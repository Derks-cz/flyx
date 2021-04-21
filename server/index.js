const express = require("express")
const app = express()
const cors = require("cors")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")
const Message = require('./models/Message')
const server = require("http").createServer(app)
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
const config = require("./config.json")
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname,"static")))
app.use(require("./api/auth/auth"))
app.use(require("./api/profile/profile"),)
app.use(require("./api/getUser/getUser"))
app.use(require("./api/friend/friend"))
app.use(require("./api/invitation/invitation"))
app.use(require("./api/chat/chat"))
const io = require("socket.io")(server)
io.of("/notification").on("connection",(socket)=>{
    socket.on("private",(data)=>{socket.join(data.userId)})  
})
io.of("/chat").on("connection", (socket)=>{
    socket.on("message",async({newMessage,myId,chatRoom})=>{
        const e = await Message.findOne({chatId:chatRoom}).select("messages")
        let id = uuid.v4()
        if(e){
            e.messages.push({id:id,from:myId,body:newMessage,createdAt:{time:new Date().toLocaleTimeString(), date: new Date().toLocaleDateString()}})
            await e.save()
      }
      io.of("/chat").to(chatRoom).emit("sendMessage",{id:id,from:myId,body:newMessage,createdAt:{time:new Date().toLocaleTimeString(), date: new Date().toLocaleDateString()}})
    })


    socket.on("USER:COONECT", async(data)=>{
        let room = data.me.chatPriority > data.chatUser.chatPriority ? data.me.id + data.chatUser.id : data.chatUser.id + data.me.id
        const message = await Message.findOne({chatId:room}).select("messages")
        socket.join(room)
        if(!message){
            const newChat = new Message({chatId:room})
            await newChat.save()
            io.of("/chat").to(room).emit("ROOM:CREATED",Math.random())
        } 
        else{
            io.of("/chat").to(room).emit("ROOM:FOUND",true)
        }
        
        
        socket.on("delete_message",async (id)=>{
            let isDeleted = false
            try{
                const allMessages = await Message.findOne({chatId:room}).select("messages")
                if(allMessages){
                allMessages.messages.forEach((obj,i)=>{
                    if(obj.id === id){
                        allMessages.messages.splice(i,1)
                        isDeleted = true
                    }
                })
                await allMessages.save()
                if(isDeleted) io.of("/chat").to(room).emit("deleted",Math.random())
            }
                
            }catch(e){
                console.log(e)
            }
        })
   })
})
app.set('socketio', io)

async function start(){
    try{
        server.listen(3001)
        await mongoose.connect(config.dbUrl,{useNewUrlParser: true})
    }
    catch(e){
     
    }
}
start()


