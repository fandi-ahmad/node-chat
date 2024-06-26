const { PrismaClient } = require('@prisma/client')
const { serverErrorJson } = require('../json/responJson')
const prisma = new PrismaClient()

const sendChat = async (req, res) => {
  try {
    const {id_user_from, id_user_to, message} = req.body
    const dateNow = new Date();
    
    const result = await prisma.chat.create({
      data: {
        id_user_from: id_user_from,
        id_user_to: id_user_to,
        message: message,
        created_at: dateNow
      },
    });

    const response = {
      status: 201,
      message: 'Send message successfully!',
      data: result
    }

    res.json(response)
  } catch (error) {
    console.log(error, '<-- error send chat');
    res.status(500).json(serverErrorJson);
  }
}

const getChatByUser = async (req, res) => {
  try {
    const {id_user_from, id_user_to} = req.body

    // const dataChat = await prisma.chat.findMany({
    //   where: {
    //     id_user_from: id_user_from,
    //     id_user_to: id_user_to
    //   }
    // })
    
    const dataChat = await prisma.chat.findMany({
      where: {
        OR: [
          {
            id_user_from: id_user_from,
            id_user_to: id_user_to
          },
          {
            id_user_from: id_user_to,
            id_user_to: id_user_from
          }
        ]
      }
    })
    
    const response = {
      status: 200,
      message: 'get chat by user successfully!',
      data: dataChat
    }

    res.json(response)
  } catch (error) {
    console.log(error, '<-- error get chat by user');
    res.status(500).json(serverErrorJson);
  }
}

module.exports = { sendChat, getChatByUser }