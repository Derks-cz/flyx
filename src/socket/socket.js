import io from 'socket.io-client'

const socketNotification = io('http://localhost:3000/notification',{reconnection:true})
const socketChat = io('http://localhost:3000/chat',{reconnection:true})

export {socketNotification,socketChat}