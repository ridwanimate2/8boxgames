const { consumers } = require("nodemailer/lib/xoauth2");
const { Game, Library, User, Consumer } = require("../models/index");
class Controller {
    static datagame(req, res) {
        Game.findAll()
            .then(data => {
                res.render("home", { data, title: 'Home' })
            })
            .catch(err => {
                res.send(err)
            })

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
                            res.redirect('/libraries')
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
                res.render('libraries', { data, title: 'Libraries' })
            })
            .catch(err => {
                res.send(err)
            })

    }

    static deleteLibrary(req, res) {
        let { id } = req.params

        Library.destroy({
            where: {
                id: id
            }
        })
            .then(() => {
                res.redirect('/libraries')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static getconregist(req, res) {
        let error = []
        if (req.query.error) {
            error = req.query.error.split(',')
        }

        res.render('consumer/conregist', { title: 'Register', error })
    }
    static postconregist(req, res) {
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
                })
            const newuser = { name, email, password, role: 'consumer', createdAt: new Date(), updatedAt: new Date() }
            return User.create(newuser)
                .then(data => {
                    const newconsumer = { age: parseInt(age), gender, Userid: data.dataValues.id, createdAt: new Date(), updatedAt: new Date() }
                    return Consumer.create(newconsumer)
                })
                .then(data => {
                    res.redirect('/')
                })
        }
    }


    static getdevregist(req, res) {
        let error = []
        if (req.query.error) {
            error = req.query.error.split(',')
        }

        res.render('developer/devregist', { title: 'Register', error })
    }
    static postdevregist(req, res) {
        const { name, email, password, age, gender } = req.body
        if (age < 12) {
            let error = 'This website is suitable for 12+'
            res.redirect(`/dev/regist?error=${error}`)
        } else {
            User.findOne({ where: { email: email } })
                .then(data => {
                    if (data) {
                        let error = 'Email already registered'
                        return res.redirect(`/dev/regist?error=${error}`)
                    }
                })
            const newuser = { name, email, password, role: 'consumer', createdAt: new Date(), updatedAt: new Date() }
            return User.create(newuser)
                .then(data => {
                    const newconsumer = { age: parseInt(age), gender, Userid: data.dataValues.id, createdAt: new Date(), updatedAt: new Date() }
                    return Consumer.create(newconsumer)
                })
                .then(data => {
                    res.redirect('/')
                })
                .catch(err => {
                    if (err.name == "SequelizeValidationError") {
                        let errors = err.errors.map(el => el.message)
                        res.redirect(`/dev/regist?errors=${errors}`)
                    } else {
                        res.send(err)
                    }
                })
        }

    }
}

module.exports = Controller