const { Game, Library, User, Consumer } = require("../models/index");
class Controller {
    static datagame(req, res) {
        Game.findAll()
            .then(data => {
                res.send(data)
            })
            .catch(err=>{
                console.log(err);
                res.send(err)
            })
            
    }
}

module.exports = Controller