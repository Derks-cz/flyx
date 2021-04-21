import React, { useEffect, useState,useRef } from 'react'
import avatar from '../images/default/avatar.jpg'
import Loading from '../components/Loading'
import Navigation from '../components/Navigation'
import {socketNotification} from '../socket/socket'
import {actionProfile} from '../redux/action/actionProfile'
import {useDebouncedEffect} from '../hooks.js/useDebouncedEffect'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
function throttle(func, timeFrame) {
    var lastTime = 0;
    return function () {
        var now = new Date();
        if (now - lastTime >= timeFrame) {
            func();
            lastTime = now;
        }
    };
}
const Profile = ({match}) =>{
    const dispatch = useDispatch()
    const history = useHistory()
    const [acceptInvite, setAcceptInvit] = useState("")
    const [removeProfileFriend,setRemoveProfileFriend] = useState("")
    const profile = useSelector(({profile})=>profile)
    const user = useSelector(({user})=>user)
    const invite = useSelector(({invite})=>invite)
    const {id,isAuth} = useSelector(({login})=>login)
    let paramsId = match.params.id
    let isMounted = useRef(false)
    useEffect(()=>{
        isMounted.current = true
        socketNotification.on("invite",(data)=>{
            if(isMounted.current) setAcceptInvit(data)
        })
        socketNotification.on("remove_friend",(data)=>{
            if(isMounted.current) setRemoveProfileFriend(data)
        })
        return () => isMounted.current = false
    },[])
    useEffect(()=>{
        if(!isAuth) history.push("/login")
    },[isAuth,history])
    useEffect(()=>{
        if(paramsId !== null){
          dispatch(actionProfile(paramsId))
        }
    },[paramsId,invite.acceptInvite,acceptInvite,removeProfileFriend])
    useEffect(()=>{
        if(!profile.found){
            history.push(`/profile/${id}`)
        }
    },[profile.found,id,history])
    
    const addFriend = ()=>{
        fetch("/friend/invite",{method:"POST",body:JSON.stringify({userID:paramsId}),headers:{'Content-Type': 'application/json'}})
        .then(async data =>{
            let payload = await data.json()
            dispatch({type:"NEW_INVITE",payload:payload})
        }).catch((e)=>new Error(e))
    }
    const removeFriend = () =>{
        fetch("/friend/remove",{method:"POST",body:JSON.stringify({userID:paramsId}),headers:{'Content-Type': 'application/json'}})
        .catch((e)=>new Error(e))
    }

    const wrapThrottle = throttle(addFriend,1000)

    return(
        <div className="container">
            {!profile.loaded && <Loading />}
            <div className="profile">
                <div className="profile_links">
                    <Navigation id={id} />
                    <div className="friend_list">
                        <h3>Список друзей</h3>
                        <div>
                            <ul>
                                {profile.friends ? profile.friends.map((obj,i)=>(
                                    <li key={i} className="friend"><Link to={`/profile/${obj._id}`}>{obj.name} {obj.surname}</Link></li>
                                )):<li>Список друзей пуст</li>}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div style={{display:"flex"}}>
                        <div style={{display:"flex",flexDirection:"column"}}>
                        <img src={avatar} alt="avatar" className="avatar" />
                        {id !== paramsId && <div style={{marginTop:"3px"}} className="link_to_dialog"><Link to={`/dialogs/${paramsId}`}>Написать сообщение</Link></div>}
                        {invite.invitesTo.includes(match.params.id)? <div>Запрос отправлен</div> : user.friends.includes(user.friends.find(el => el._id === match.params.id))
                        ?<div className="remove_friend" onClick={removeFriend}>Удалить из друзей</div>: match.params.id !== id ? <div className="add_friend" onClick={wrapThrottle}>Добавить в друзья</div>
                        :"" }
                        </div>
                        <div className="profile_info">
                        <div style={{borderBottom:"1px solid black"}}><h3><span style={{marginRight:"5px"}}>{profile.name}</span><span>{profile.surname}</span></h3></div>
                        <div className="profile_brithday">
                            <p style={{flex:"2 0 0"}}>День рождения:</p>
                            <p style={{flex:"1 0 70%"}}>{profile.brithday.day} {profile.brithday.month} {profile.brithday.year} г.</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Profile)