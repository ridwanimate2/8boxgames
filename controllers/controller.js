const bcryptjs = require('bcryptjs')
const { Op } = require('sequelize')
const formatPrice = require('../helpers/formatPrice')
const userBill = require('../helpers/userBill')

const { consumers } = require("nodemailer/lib/xoauth2");
const { Game, Library, User, Consumer } = require("../models/index");
class Controller {
    static datagame(req, res) {
        let { title } = req.query
        if (!title) {
            Game.findAll()
                .then(data => {
                    res.render("home", { data, formatPrice, title: 'Home' })
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
                    res.render("home", { data, formatPrice, title: 'Home' })
                })
                .catch(err => {
                    res.send(err)
                })
        }

    }
    static buyGame(req, res) {

        let { id } = req.params
        Game.findAll({
            include: {
                model: User
            },
            where: {
                id: id
            }
        })
            .then(data => {

                data.forEach(el => {
                    Library.create({
                        UserId: el.User.id,
                        GameId: el.id
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
        Library.findAll({
            include: [{
                model: Game
            },
            {
                model: User
            }]
        })
            .then(data => {
                res.render('libraries', { data, formatPrice, userBill, title: 'Libraries' })
            })
            .catch(err => {
                res.send(err)
            })

    }

    static deleteLibrary(req, res) {
        let { id } = req.params
        Library.destroy({
            where: {
                GameId: id
            }
        })
            .then(() => {
                res.redirect('/user/libraries')
            })
            .catch(err => {
                res.send(err)
            })
    }




    //STATIC DEV//

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
                    const newconsumer = { age: parseInt(age), gender, Userid: data.dataValues.id, createdAt: new Date(), updatedAt: new Date() }
                    return Consumer.create(newconsumer)
                })
                .then(data => res.redirect('/'))

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
        console.log(req.session.users);
        const {email,password} = req.body
        User.findOne({
            where:{email:email}
        })
        .then(data=>{
            
            if(data){
                let login = bcryptjs.compareSync(password,data.dataValues.password)
                if(login){
                    req.session.user = {UserId: data.dataValues.id, role: data.dataValues.role}
                    res.redirect('/')
                }else{
                    let error = `Incorrect Email/Password`
                    res.redirect(`/user/login?error=${error}`)
                }
            }else{
                let error = `Incorrect Email/Password`
                return res.redirect(`/user/login?error=${error}`)
            }
        })
        .catch(err=>{
            res.send(err)
        })

    }

    static getuserlogout(req,res){
        req.session.destroy(err=>{
            if(err){
                res.send(err)
            } else{
                res.redirect('/user')
            }
        })
    }


}

module.exports = Controller