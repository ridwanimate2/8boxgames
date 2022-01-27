const express = require('express')
const router = express.Router()
const userRouter = require('./user.js')
const devRouter = require('./dev.js')
const mainController = require('../controllers/controller')
const Controller = require('../controllers/controller')

router.get('/', Controller.home)

router.use('/user', userRouter)
router.use('/dev', devRouter)

module.exports = router;