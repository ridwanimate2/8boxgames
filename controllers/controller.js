const { Game, Library, User, Consumer } = require("../models/index");
class Controller {
    static datagame(req, res) {
        Game.findAll()
            .then(data => {
                res.render("home", { data ,title: 'Home' })
            })
            .catch(err => {
                res.send(err)
            })

    }
    static buyGame(req, res){

    }


    static devregist(req,res){
        let errors =[]
        res.render('dev/devregist',{title:'Register'})
    }
}

module.exports = Controller