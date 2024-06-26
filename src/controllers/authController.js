const { compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const dataUser = await prisma.user.findFirst({
      where: { email: email }
    });

    if (!dataUser) {
      return res.status(400).json({
        status: 400,
        message: 'Email not registered!',
      })
    }

    const match = await compare(password, dataUser.password)
    if(!match) {
      return res.status(400).json({
        status: 400,
        message: 'Password is wrong!',
      })
    }

    const userId = dataUser.id
    const userEmail = dataUser.email

    const accessToken = sign({userId, userEmail}, process.env.NODE_CHAT_ACCESS_TOKEN, {
      expiresIn: '30s'
    })

    const refreshToken = sign({userId, userEmail}, process.env.NODE_CHAT_REFRESH_TOKEN, {
      expiresIn: '1d'
    })

    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken }
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 30,
      secure: true,
      sameSite: 'strict',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: 'strict',
    })

    // res.header('Access-Control-Allow-Credentials', true);
    res.json({
      status: 200,
      message: 'login successfully',
    })
  } catch (error) {
    console.log(error, '<-- error login user');
    res.status(500).json(serverErrorJson);
  }
}

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.clearCookie('refreshToken')

    const dataUser = await prisma.user.findFirst({
      where: { refresh_token: refreshToken }
    });

    if(!dataUser) return res.clearCookie('refreshToken')
    const userId = dataUser.id

    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null }
    });

    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    return res.status(200).json({ status: 200, message: 'logout successfully' })
  } catch (error) {
    console.log(error, '<-- error logout user');
    res.status(500).json(serverErrorJson);
  }
}


module.exports = { loginUser, logoutUser }