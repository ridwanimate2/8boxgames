
// npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string


//npx sequelize-cli model:generate --name Consumer --attributes gender:string,age:integer,UserId:integer


//npx sequelize-cli model:generate --name Game --attributes title:string,genre:string,price:integer,rating:integer,UserId:integer,description:text

//npx sequelize migration:generate --name add-imageurl-on-Game

//npx sequelize-cli model:generate --name Library --attributes UserId:INTEGER,GameId:INTEGER

// npx sequelize db:migrate

// npx sequelize-cli seed:generate --name seed-user
// npx sequelize-cli seed:generate --name seed-games
// npx sequelize-cli seed:generate --name seed-consumer

// npx sequelize-cli db:create 
// npx sequelize-cli db:migrate
//npx sequelize-cli db:seed:all

const session = require('express-session')
const express = require("express");
const Controller = require("./controllers/controller");
const app = express()
const port = 3000

// app.get("/", (req, res) => {
//     res.send("Hello World")
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.use(session({
    secret: 'login',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))



app.get("/user/regist", Controller.getuserregist)
app.post("/user/regist", Controller.postuserregist)


app.get("/user/login", Controller.getuserlogin)
app.post("/user/login", Controller.postuserlogin)

app.get("/user/logout", Controller.getuserlogout)


app.use((req, res, next) => {
    
    if (req.session.user) {
        if (req.session.user.role == 'consumer') {
            next()
        } else {
            let error = 'Maaf anda seorang developer. Silahkan masuk di page developer.'
            res.redirect(`/user/login?error=${error}`)
        }
    } else {
        let error = 'Harap login terlebih dahulu.'
        res.redirect(`/user/login?error=${error}`)
    }
})


app.get("/user",(req,res)=> res.redirect('/'))

app.get("/", Controller.datagame)
app.get('/user/libraries', Controller.getLibraries)
app.get('/user/libraries/:id/delete', Controller.deleteLibrary)



app.get("/user/:id", Controller.buyGame)


//developer
// app.get("/dev/regist",Controller.getdevregist)
// app.post("/dev/regist",Controller.postdevregist)

app.get("/dev", Controller.devHome)