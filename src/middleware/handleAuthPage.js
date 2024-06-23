const { sign, verify } = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const handleAuthPage = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies

    if (accessToken) {
      verify(accessToken, process.env.NODE_CHAT_ACCESS_TOKEN, (err, decode) => {
        if (err) res.clearCookie('accessToken');
  
        // Token valid, tambahkan header "Authorization" dengan token
        // req.headers['Authorization'] = `Bearer ${accessToken}`;
        res.redirect('/')
      });
    }

    if (!accessToken && refreshToken) {
      const dataUser = await prisma.user.findFirst({
        where: { refresh_token: refreshToken }
      });

      if(!dataUser) return next()

      verify(refreshToken, process.env.NODE_CHAT_REFRESH_TOKEN, (err, decoded) => {
        if(err) return next()
        const userId = dataUser.id
        const userEmail = dataUser.email
        const accessToken = sign({userId, userEmail}, process.env.NODE_CHAT_ACCESS_TOKEN, {
          expiresIn: '30s'
        })
  
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 30,
          secure: true,
          sameSite: 'none',
        })

        res.redirect('/')
      })
    }

    next();
  } catch (error) {
    console.log(error, '<-- error handle auth page');
    res.status(500).json(serverErrorJson);
  }
}

module.exports = { handleAuthPage }