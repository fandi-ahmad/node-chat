const router = require("express").Router()
const viewRouter = require('./viewRouter')
const userRouter = require('./userRouter')
const authRouter = require('./authRouter')
const chatRouter = require('./chatRouter')

router.use('/', viewRouter)
router.use('/api/user', userRouter)
router.use('/api/auth', authRouter)
router.use('/api/chat', chatRouter)

module.exports = router