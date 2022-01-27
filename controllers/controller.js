const bcryptjs = require('bcryptjs')
const { Op } = require('sequelize')
const formatPrice = require('../helpers/formatPrice')
const userBill = require('../helpers/userBill')


const { Game, Library, User, Consumer } = require("../models/index");
class Controller {

    static home(req, res) {
        res.render('home', { title: "Welcome to 8Box Games" })
    }







    static datagame(req, res) {

        let iduser = req.session.user.UserId
        let { title } = req.query
        if (!title) {
            Game.findAll()
                .then(data => {
                    res.render("user/userhome", { data, formatPrice, title: 'Home', dataid: iduser })
                })
                .catch(err => {
                    res.send(err)
                })

        } else {
            Game.findAll({
                where: {
                    title: {
                        [Op.iLike]: `%${title}%`
                    }
                }
            })
                .then(data => {
                    res.render("user/userhome", { data, formatPrice, title: 'Home', dataid: iduser })
                })
                .catch(err => {
                    res.send(err)
                })
        }
    }

    static buyGame(req, res) {
        let iduser = req.session.user.UserId
        let { devid } = req.params
        Game.findAll({
            include: {
                model: User
            },
            where: {
                id: devid
            }
        })
            .then(data => {

                data.forEach(el => {
                    Library.create({
                        UserId: iduser,
                        GameId: devid
                    })
                        .then(() => {
                            res.redirect('/user/libraries')
                        })
                        .catch(err => {
                            res.send(err)
                        })
                });
            })
            .catch(err => {
                res.send(err)
            })
    }

    static getLibraries(req, res) {
        let iduser = req.session.user.UserId

        Library.findAll({
            include: [{
                model: Game
            },
            {
                model: User
            }],
            where: {
                UserId: iduser
            }
        }
        )
            .then(data => {
                res.render('user/libraries', { data, formatPrice, userBill, title: 'Libraries', dataid: iduser })
            })
            .catch(err => {
                res.send(err)
            })

    }

    static deleteLibrary(req, res) {
        let iduser = req.session.user.UserId
        let { devid } = req.params
        Library.destroy({
            where: {
                UserId: iduser,
                GameId: devid

            }
        })
            .then(() => {
                res.redirect('/user/libraries')
            })
            .catch(err => {
                res.send(err)
            })
    }






    static getuserregist(req, res) {
        let error = []
        if (req.query.error) {
            error = req.query.error.split(',')
        }
        res.render('user/userregist', { title: 'Register', error })
    }

    static postuserregist(req, res) {
        const { name, email, password, age, gender } = req.body
        if (age < 12) {
            let error = 'This website is suitable for 12+'
            res.redirect(`/user/regist?error=${error}`)
        } else {

            User.findOne({ where: { email: email } })
                .then(data => {
                    if (data) {
                        let error = 'Email already registered'
                        return res.redirect(`/user/regist?error=${error}`)
                    }
                    const newuser = { name, email, password, role: 'consumer', createdAt: new Date(), updatedAt: new Date() }
                    return User.create(newuser)
                })


                .then(data => {
                    const newconsumer = { age: parseInt(age), gender, UserId: data.dataValues.id, createdAt: new Date(), updatedAt: new Date() }
                    return Consumer.create(newconsumer)
                })
                .then(data => res.redirect('/user'))

                .catch(err => {
                    if (err.name == "SequelizeValidationError") {
                        let error = err.error.map(v => v.message)
                        res.redirect(`/user/regist?error=${error}`)
                    } else {
                        res.send(err)
                    }
                })

        }
    }


    static getuserlogin(req, res) {
        let error = []
        if (req.query.error) {
            error = req.query.error.split(',')
        }
        res.render('user/userlogin', { title: 'User login', error })

    }

    static postuserlogin(req, res) {
        // console.log(req.session.user);
        const { email, password } = req.body
        User.findOne({
            where: { email: email }
        })
            .then(data => {

                if (data) {
                    let login = bcryptjs.compareSync(password, data.dataValues.password)
                    if (login) {
                        req.session.user = { UserId: data.dataValues.id, role: data.dataValues.role }
                        res.redirect('/user')
                    } else {
                        let error = `Incorrect Email/Password`
                        res.redirect(`/user/login?error=${error}`)
                    }
                } else {
                    let error = `Incorrect Email/Password`
                    return res.redirect(`/user/login?error=${error}`)
                }
            })
            .catch(err => {
                res.send(err)
            })

    }

    static getuserlogout(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/user')
            }
        })
    }


    //--------------------------------------------------------------------


    static devHome(req, res) {
        Game.findAll({
            include: {
                model: User
            }
        })
            .then(data => {
                res.send(data)
            })
        // res.render('devHome', {title: 'Dev Home'})
    }



    static getdevregist(req, res) {
        let error = []
        if (req.query.error) {
            error = req.query.error.split(',')
        }
        res.render('dev/devregist', { title: 'Register', error })
    }

    static postdevregist(req, res) {
        const { name, email, password, age, gender } = req.body

        User.findOne({ where: { email: email } })
            .then(data => {
                if (data) {
                    let error = 'Email already registered'
                    return res.redirect(`/dev/regist?error=${error}`)
                }
                const newuser = { name, email, password, role: 'developer', createdAt: new Date(), updatedAt: new Date() }
                return User.create(newuser)
            })

            .then(data => res.redirect('/dev'))

            .catch(err => {
                if (err.name == "SequelizeValidationError") {
                    let error = err.error.map(v => v.message)
                    res.redirect(`/dev/regist?error=${error}`)
                } else {
                    res.send(err)
                }
            })


    }

    static getdevlogin(req, res) {

    }
    static postdevlogin(req, res) {

    }
    static getdevlogout(req, res) {

    }






}

module.exports = Controller