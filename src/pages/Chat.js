import React, { useCallback, useEffect, useRef, useState } from 'react'
import {socketChat} from '../socket/socket'
import trash from '../images/trash.png'
import Navigation from '../components/Navigation'
import FriendList from '../components/FriendList'
import LoadingMessages from '../components/LoadingMessages'
import Loading from '../components/Loading'
import {Link, useHistory} from 'react-router-dom'
import {useSelector } from 'react-redux'

const Chat = ({match}) =>{
    const history = useHistory()
    const [loaded,setLoaded] = useState(true)
    const [chatUser,setChatUser] = useState({})
    const [messages,setMessages] = useState([])
    const [deletedMessage,setDeletedMessage] = useState("")
    const [chatRoom, setChatRoom] = useState("")
    const [loadingMessages,setLoadingMesseges] = useState(false)
    const [paramsId,setParamsId] = useState("")
    const [creactedRoom,setCreatedRoom] = useState("")
    const [foudedRoom,setFoundedRoom] = useState(false)
    const {id} = useSelector(({login})=>login)
    const user = useSelector(({user})=>user)
    const ref = useRef()
    const buttonRef = useRef()
    let isMounted = useRef(false)
    useEffect(()=>{
        if(match.params.id) setParamsId(match.params.id)
    },[match.params.id])
    const clickSendMessage = useCallback(() =>{
        if(ref.current.value.trim() && user.id && chatRoom){
            socketChat.emit("message",{newMessage:ref.current.value,myId:user.id,chatRoom:chatRoom})
            ref.current.value=""
            return
        }
    },[user.id,chatRoom])

    const keyPressSendMessage = useCallback((e)=>{
         if(e.key === "Enter") {  
                   buttonRef.current.click()
                   ref.current.value= "" 
                   return  
         }
    },[])
    useEffect(()=>{
        let button = buttonRef.current
        
        button.addEventListener("click",clickSendMessage)
        document.addEventListener("keypress",keyPressSendMessage)
        
        return ()=>{
            button.removeEventListener("click",clickSendMessage)
            document.removeEventListener("keypress",keyPressSendMessage)
        }
    },[clickSendMessage,keyPressSendMessage])
    useEffect(()=>{
        isMounted.current = true
        if(isMounted.current){
        if(paramsId && chatUser.chatPriority && user.chatPriority){
         socketChat.emit("USER:COONECT",{me:{chatPriority:user.chatPriority,id:id},chatUser:{chatPriority:chatUser.chatPriority,id:paramsId}})
        }
     }
        return () => {
            socketChat.emit("leave",{})
            isMounted.current = false
        }
    
    },[paramsId,chatUser.chatPriority,id,user.chatPriority])
    useEffect(()=>{
        isMounted.current = true 
        socketChat.on("deleted",(data)=>{
           if(isMounted.current) setDeletedMessage(data)
        })
        socketChat.on("ROOM:FOUND",(data)=>{if(isMounted.current) setFoundedRoom(data)})
        socketChat.on("ROOM:CREATED",(data)=>{if(isMounted.current) setCreatedRoom(data)})
        socketChat.on("sendMessage",(data)=>{if(isMounted.current) setMessages(prev=>[...prev,data])})
         return () => isMounted.current = false      
    },[])
    useEffect(()=>{
        isMounted.current = true
        if(user.chatPriority && chatUser.chatPriority && paramsId && user.id){
             let room= user.chatPriority > chatUser.chatPriority ? user.id + paramsId : paramsId + user.id
             setChatRoom(room)
             if(foudedRoom){
             setLoadingMesseges(true)
             fetch(`/chat/chatId?id=${room}`)
             .then(async data =>{
               if(isMounted.current) setLoaded(true)
                let message = await data.json()
                 if(data.ok) if(isMounted.current) setMessages(message)
                 setLoadingMesseges(false)
                })
            }
        }
        return () => isMounted.current = false
    },[paramsId,user.chatPriority,chatUser.chatPriority,user.id,creactedRoom,deletedMessage,foudedRoom])

    useEffect(()=>{
        isMounted.current = true
        if(isMounted) if(paramsId) fetch("/chat/add/dialogs",{method:"POST",body:JSON.stringify({id:paramsId}),headers:{'Content-Type': 'application/json'}})
        return () => isMounted.current = false
    },[creactedRoom,paramsId])
    useEffect(()=>{
        isMounted.current = true
        if(paramsId) {
            fetch(`/chat/user?id=${paramsId}`)
            .then(async data=> {
                if(data.ok) if(isMounted.current) setChatUser(await data.json())
                else history.push("/dialogs")
            })}
            return () => isMounted.current = false
    },[paramsId])
    useEffect(()=>{
        let m = document.querySelector(".messages")
        if(messages.length){
            m.scrollTo(0,9999)
        }
    },[messages])

    const deleteMessage = useCallback((id)=>{
        socketChat.emit("delete_message",id)
    },[])
    return (
    <div className="container">
        {!loaded && <Loading />}
        <div className="profile">
            <div className="profile_links">
                    <Navigation id={id} />
                    <FriendList user={user} />
                </div>
                <div className="chat">
                        <div className="chat_header">
                            <Link to={`/profile/${paramsId}`}>{chatUser.name} {chatUser.surname}</Link>
                        </div>  
                        <div className="messages">
                            {loadingMessages && <LoadingMessages />}
                            {messages && messages.map((obj,i)=>(
                                <div key={i} className={`chat_message ${obj.from === user.id ? "my_chat_message":""}`}>
                                    <div className="message_wrap">
                                        {obj.from === id && <div onClick={()=>deleteMessage(obj.id)} className="delete_message"><img src={trash} alt="Удалить сообщение"/></div>}
                                        <div className="message_time">{obj.createdAt.date} {obj.createdAt.time}</div>
                                        <div className="body_message">
                                            {obj.body && <p>{obj.body}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="input_message">
                            <input ref={ref} type="text" className="input_chat_message" />
                            <div className="send_message">
                                <button disabled={loadingMessages && true} ref={buttonRef} className="button_send">Отправить</button>
                            </div>
                        </div>
                </div>
         </div>
    </div>
    )
}

export default React.memo(Chat)