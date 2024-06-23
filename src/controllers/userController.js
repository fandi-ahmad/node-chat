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


module.exports = { createUser }