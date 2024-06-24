const { genSalt, hash } = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const createUser = async (req, res) => {
  try {
    const {email, password} = req.body
    const salt = await genSalt()
    const hashPassword = await hash(password, salt)

    const result = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword
      },
    });

    const response = {
      status: 201,
      message: 'Register successfully!',
      data: result
    }

    res.json(response)
  } catch (error) {
    console.log(error, '<-- error');
    res.status(500).json(serverErrorJson);
  }
}

const getAllUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies

    const currentUserLogin = await prisma.user.findFirst({
      where: { refresh_token: refreshToken }
    })

    if (!currentUserLogin) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }

    const allUser = await prisma.user.findMany({
      where: {
        email: {
          not: currentUserLogin.email
        }
      },
      select: {
        id: true,
        email: true,
      },
    });
    

    const response = {
      status: 200,
      message: 'ok',
      data: allUser
    }

    res.json(response)

  } catch (error) {
    console.log(error, '<-- error get all user');
    res.status(500).json(serverErrorJson);
  }
}


module.exports = { createUser, getAllUser }