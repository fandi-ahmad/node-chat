const router = require("express").Router()
const viewRouter = require('./viewRouter')
const userRouter = require('./userRouter')
const authRouter = require('./authRouter')

router.use('/', viewRouter)
router.use('/api/user', userRouter)
router.use('/api/auth', authRouter)

module.exports = router