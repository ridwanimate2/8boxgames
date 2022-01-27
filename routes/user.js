const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

router.get("/regist", Controller.getuserregist)
router.post("/regist", Controller.postuserregist)


router.get("/login", Controller.getuserlogin)
router.post("/login", Controller.postuserlogin)

router.get("/logout", Controller.getuserlogout)


router.use((req, res, next) => {

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




router.get("/", Controller.datagame)
router.get('/libraries', Controller.getLibraries)
router.get('/libraries/delete/:devid/:id', Controller.deleteLibrary)



router.get("/buy/:devid/:id", Controller.buyGame)


module.exports = router;