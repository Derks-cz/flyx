import React, { useEffect, useState,useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {socketNotification} from '../socket/socket'
import {actionLogOut} from '../redux/action/actionLogin'
import Invitation from './Invitation'
import {Link, useHistory} from 'react-router-dom'
import { actionInvitations } from '../redux/action/actionInvitations'
const Header = () =>{
    const dispatch = useDispatch()
    const history = useHistory()
    const [notification, setNotification] = useState("")
    const [rerender,setRerender] = useState("")
    const {isAuth,id} = useSelector(({login})=>login)
    const invite = useSelector(({invite})=>invite)
    const modal = document.querySelector(".modal")
    const modalContent = document.querySelector(".modal_content")
    const openModal = useCallback(()=>{
        if(modal && modalContent){
        modal.classList.add("open_modal")
        modalContent.classList.add("active_modal")
        }
    },[modal,modalContent])
    useEffect(()=>{
        document.onclick = (e)=>{
            if(modal && modal.classList.contains("open_modal")){
                if((!e.target.closest(".modal_wrap") || !e.target.closest(".modal_content") || e.target.closest(".link_to_friend")) && !e.target.closest("#open") ){
                    modal.classList.remove("open_modal")
                    modalContent.classList.remove("active_modal")
                }
        }}
    },[modal,modalContent])
    useEffect(()=>{
        if(isAuth){
            dispatch(actionInvitations())
            socketNotification.on("invite",(data)=>{setNotification(data)})
        }
    },[isAuth,rerender,notification,invite.newInvite,dispatch])
    const logOut = useCallback((e)=>{
        e.preventDefault()
        dispatch(actionLogOut())
        dispatch({type:"LOGOUT_USER"})
        dispatch({type:"CLEAR_PROFILE"})
        setTimeout(() => {
            history.push("/")
        }, 1000);
    },[dispatch,history])
    return(
        <header>
            <Invitation invite={invite.invitesFrom} setRerender={setRerender} />
            <div className="container">
                <div className="header_row">
                    <div className="logo">
                        <Link to="/">Flyx</Link>
                    </div>
                    <div className="links">
                    {isAuth ? 
                    <div style={{display:"flex"}}><Link to={`/profile/${id}`}>Профиль</Link><div id="open" onClick={openModal} style={{marginLeft:"10px",cursor:"pointer"}}>&#128365;</div>
                    <sub style={{color:"red",padding:"5px"}}>{invite.invitesFrom.length&& invite.invitesFrom.length}</sub><div style={{cursor:"pointer"}} onClick={logOut}>Выйти</div></div> :
                    <Link to="/login">Войти</Link>}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header