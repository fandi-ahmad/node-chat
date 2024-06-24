const router = require("express").Router()
const { sendChat, getChatByUser } = require('../controllers/chatController')

router.post('/send', sendChat)
router.post('/chat-by-user', getChatByUser)

module.exports = router