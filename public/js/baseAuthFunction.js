let valueEmail = document.getElementById('email')
let valuePassword = document.getElementById('password')
const actionBtn = document.getElementById('actionBtn')
const loadingProcess = document.getElementById('loadingProcess')
const alertContainer = document.getElementById('alertContainer')
const alertMessage = document.getElementById('alertMessage')

const disabledBtn = () => {
  loadingProcess.classList.remove('hidden')
  actionBtn.setAttribute('disabled', '')
}

const removeDisabled = () => {
  loadingProcess.classList.add('hidden')
  actionBtn.removeAttribute('disabled')
}

const showAlert = (message) => {
  alertContainer.classList.remove('hidden')
  alertMessage.innerText = message
  setTimeout(() => {
    alertContainer.classList.add('hidden')
  }, 5000)
}