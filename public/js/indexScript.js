const chatContainer = document.getElementById('chatContainer')
const textInput = document.getElementById('textInput')

const emptyChatThumbnail = document.getElementById('emptyChatThumbnail')
const textInputContainer = document.getElementById('textInputContainer')

const socket = io()

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

const createBubbleChat  = (chat, isSender) => {
  const divContainer = document.createElement('div');
  divContainer.innerHTML = /*html*/`
    <div class="w-full flex ${isSender ? 'justify-end pl-60' : 'justify-start pr-60'}">
      <div class="${isSender ? 'bg-green-700' : 'bg-slate-700'} p-2 mb-3 rounded-md w-fit flex flex-col">
        <span>${chat}</span>
        <span class="text-xs opacity-75 ${isSender ? 'text-left' : 'text-right'}">${getCurrentTime()}</span>
      </div>
    </div>
  `;
  return divContainer
}

const sendMessage = () => {
  if (textInput.value != '') {
    const bubbleChat = createBubbleChat(textInput.value, true)
    chatContainer.appendChild(bubbleChat)
    socket.emit('send_message', textInput.value)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    sendChatMessage()
    textInput.value = ''
  }
}

socket.on('new_message', pesan => {
  const bubbleChat = createBubbleChat(pesan, false)
  bubbleChat.classList.add('pesan-new')
  chatContainer.appendChild(bubbleChat)
  chatContainer.scrollTop = chatContainer.scrollHeight;
})

// ======== LOGOUT USER =========
const logoutUser = () => {
  fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    if (data.status === 200) {
      window.location.href = "/login";
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// ======== GET ALL USERS =========
const contactListContainer = document.getElementById('contactListContainer')
let currentUserId = null

const getAllUser = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    currentUserId = data.current_user.id

    // Bersihkan kontainer sebelum menambah elemen baru
    contactListContainer.innerHTML = '';

    // Loop melalui data dan buat elemen untuk setiap email
    data.data.forEach(user => {
      const email = user.email;
      const firstNameInitial = email.charAt(0).toUpperCase();

      const emailDiv = /*html*/`
        <div onclick="getIdUser(${user.id})" class="p-3 border-slate-500 border-t border-1 flex flex-row items-center w-full cursor-pointer hover:bg-slate-600 duration-200">
          <div class="rounded-full bg-green-500 h-12 min-w-12 flex justify-center items-center">
            <span class="text-2xl font-semibold">${firstNameInitial}</span>
          </div>
          <div class="w-full ml-3">
            <div>${email}</div> 
          </div>
        </div>
      `;

      contactListContainer.insertAdjacentHTML('beforeend', emailDiv);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

let idUserForChat = null
const asideBar = document.getElementById('asideBar')
const mainContainer = document.getElementById('mainContainer')

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    chatContainer.style.height = '90%'
  } else {
    chatContainer.style.height = '80%'
  }
})

const getIdUser = (id) => {
  idUserForChat = id
  emptyChatThumbnail.classList.add('hidden')
  chatContainer.classList.remove('hidden')
  textInputContainer.classList.remove('hidden')
  if (window.innerWidth < 768) {
    asideBar.classList.add('hidden')
    mainContainer.classList.remove('hidden')
  }
  
  getChatByUser()
}

const backToContactList = () => {
  asideBar.classList.remove('hidden')
  mainContainer.classList.add('hidden')
}

// ======== GET CHAT BY USER ========
const getChatByUser = async () => {
  try {
    const dataSend = {
      id_user_from: currentUserId,
      id_user_to: idUserForChat
    }
    const response = await fetch('/api/chat/chat-by-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSend)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Bersihkan kontainer sebelum menambah elemen baru
    chatContainer.innerHTML = '';

    const convertTime = (time) => {
      const date = new Date(time);
      date.setTime(date.getTime() + 8 * 60 * 60 * 1000);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      return formattedTime
    }

    // Loop melalui data dan buat elemen untuk setiap email
    data.data.forEach(chat => {
      const chatDiv = /*html*/`
        <div class="w-full flex ${chat.id_user_from === currentUserId ? 'justify-end pl-10 md:pl-60' : 'justify-start pr-10 md:pr-60'}">
          <div class="${chat.id_user_from === currentUserId ? 'bg-green-700' : 'bg-slate-700'} p-2 mb-3 rounded-md w-fit flex flex-col">
            <span>${chat.message}</span>
            <span class="text-xs opacity-75 ${chat.id_user_from === currentUserId ? 'text-left' : 'text-right'}">${convertTime(chat.created_at)}</span>
          </div>
        </div>
      `;
      chatContainer.insertAdjacentHTML('beforeend', chatDiv);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
  }
}


// ======== SEND CHAT MESSAGE ========
const sendChatMessage = async () => {
  try {
    const dataSend = {
      id_user_from: currentUserId,
      id_user_to: idUserForChat,
      message: textInput.value,
    }
    console.log({dataSend});
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSend)
    });

    const data = await response.json();

  } catch (error) {
    console.error('Error:', error);
  }
}

window.addEventListener('load', () => {
  if (window.innerWidth > 768) {
    chatContainer.style.height = '90%'
  } else {
    chatContainer.style.height = '80%'
  }
  getAllUser()
})