
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

const router = require('./routes/index')
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

app.use('/', router)




//developer
// app.get("/dev/regist",Controller.getdevregist)
// app.post("/dev/regist",Controller.postdevregist)

