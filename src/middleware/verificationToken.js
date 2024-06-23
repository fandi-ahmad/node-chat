const { sign, verify } = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const verificationToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies

    if (!accessToken) {
      // if(!refreshToken) return res.status(401).json({ status: 401, message: 'Unauthorized' })
      if(!refreshToken) return res.redirect('/login')

      const dataUser = await prisma.user.findFirst({
        where: { refresh_token: refreshToken }
      });

      if(!dataUser) return res.status(401).json({ status: 401, message: 'Unauthorized' })

      verify(refreshToken, process.env.NODE_CHAT_REFRESH_TOKEN, (err, decoded) => {
        if(err) return res.sendStatus(403)
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
  
      })

    } else {
      verify(accessToken, process.env.NODE_CHAT_ACCESS_TOKEN, (err, decode) => {
        // if (err) res.status(403).json({ status: 403, message: 'access token invalid' });
        if (err) res.redirect('/login')
  
        // Token valid, tambahkan header "Authorization" dengan token
        req.headers['Authorization'] = `Bearer ${accessToken}`;
      });
    }
    
    next();
  } catch (error) {
    console.log(error, '<-- error verification token');
    res.status(500).json(serverErrorJson);
  }
}

module.exports = { verificationToken }