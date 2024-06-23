const router = require("express").Router()
const { mainPage, loginPage, registerPage } = require('../controllers/viewController')
const { verificationToken } = require('../middleware/verificationToken')
const { handleAuthPage } = require('../middleware/handleAuthPage')

router.get('/', verificationToken, mainPage)
router.get('/login', handleAuthPage, loginPage)
router.get('/register', handleAuthPage, registerPage)

module.exports = router