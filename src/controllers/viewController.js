const { serverErrorJson } = require('../json/responJson')

const returnPage = async (res, fileComponent) => {
  try {
    res.render(fileComponent)
  } catch (error) {
    res.status(500).json(serverErrorJson);
  }
}

const mainPage = async (req, res) => {
  returnPage(res, 'index')
}

const loginPage = async (req, res) => {
  returnPage(res, 'auth/login')
}

const registerPage = async (req, res) => {
  returnPage(res, 'auth/register')
}


module.exports = { mainPage, loginPage, registerPage }