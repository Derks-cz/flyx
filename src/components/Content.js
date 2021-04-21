import React , {useEffect} from 'react'
import { actionAuth } from "../redux/action/actionLogin"
import {socketNotification} from '../socket/socket'
import { useDispatch} from 'react-redux'
const Content = ({children,isAuth,id,setAcceptedInvitation,setRemoveFriend}) =>{
    const dispatch = useDispatch()
    useEffect(()=>{
        if(isAuth){
          if(id) socketNotification.emit("private",{userId:id})
          socketNotification.on("invite",(data)=>{
            setAcceptedInvitation(data)
          })
          socketNotification.on("remove_friend",(data)=>{
            setRemoveFriend(data)
          })
        }
      },[isAuth,id,setAcceptedInvitation,setRemoveFriend])
    useEffect(()=>{
        let interval
            interval = setInterval(()=>{
                if(isAuth)
                dispatch(actionAuth())
            },5*60*1000)
       
        return ()=>{
            clearInterval(interval)
        }
    },[isAuth,dispatch])
    return(
        <>
        {children}
        </>
    )
}
export default React.memo(Content)