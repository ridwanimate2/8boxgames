const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get("/", Controller.devHome)
router.get("/regist", Controller.getdevregist)
router.post("/regist", Controller.postdevregist)



router.get("/login", Controller.getdevlogin)
router.post("/login", Controller.postdevlogin)

router.get("/logout", Controller.getdevlogout)


module.exports = router;