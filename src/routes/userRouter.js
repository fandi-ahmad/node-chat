const router = require("express").Router()
const { createUser, getAllUser } = require('../controllers/userController')

router.post('/create', createUser)
router.get('/', getAllUser)

module.exports = router