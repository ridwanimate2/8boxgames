
// npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string


//npx sequelize-cli model:generate --name Consumer --attributes gender:string,age:integer,UserId:integer


//npx sequelize-cli model:generate --name Game --attributes title:string,genre:string,price:integer,rating:integer,imageurl:string,UserId:integer,description:text


//npx sequelize-cli model:generate --name Library --attributes UserId:INTEGER,GameId:INTEGER

// npx sequelize db:migrate

// npx sequelize-cli seed:generate --name seed-user
// npx sequelize-cli seed:generate --name seed-games
// npx sequelize-cli seed:generate --name seed-consumer

// npx sequelize-cli db:create 
// npx sequelize-cli db:migrate
//npx sequelize-cli db:seed:all


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


app.get("/",Controller.datagame)