const { genSalt, hash } = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const createUser = async (req, res) => {
  try {
    const {email, password} = req.body
    const salt = await genSalt()
    const hashPassword = await hash(password, salt)

    const dataUser = await prisma.user.findFirst({
      where: { email: email }
    })

    if (dataUser) {
      return res.status(400).json({ status: 400, message: 'Email is registered!' })
    }

    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword
      },
    });

    res.json({
      status: 201,
      message: 'Register successfully!',
    })
  } catch (error) {
    console.log(error, '<-- error create/register user');
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
      current_user: {
        id: currentUserLogin.id,
        email: currentUserLogin.email
      },
      data: allUser
    }

    res.json(response)

  } catch (error) {
    console.log(error, '<-- error get all user');
    res.status(500).json(serverErrorJson);
  }
}


module.exports = { createUser, getAllUser }