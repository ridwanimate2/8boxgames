const bcryptjs = require('bcryptjs')
const { Op } = require('sequelize')
const formatPrice = require('../helpers/formatPrice')
const userBill = require('../helpers/userBill')

const { consumers } = require("nodemailer/lib/xoauth2");
const { Game, Library, User, Consumer } = require("../models/index");
class Controller {
    static datagame(req, res) {
        let {title} = req.query
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
                    where:{
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
            let check= true
            User.findOne({ where: { email: email } })
                .then(data => {
                    if (data) {
                        let error = 'Email already registered'
                        check = false
                        return res.redirect(`/user/regist?error=${error}`)
                    }
                })
           
            const newuser = { name, email, password, role: 'consumer', createdAt: new Date(), updatedAt: new Date() }
            return User.create(newuser)
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


    static getuserlogin(req,res){
        

    }
    
    static postuserlogin(req,res){
        

    }



}

module.exports = Controller