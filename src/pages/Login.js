import React, { useState,useEffect, useCallback} from 'react'
import {actionLogin} from '../redux/action/actionLogin'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory} from 'react-router'
import { actionAuth } from "../redux/action/actionLogin"
const month = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
const Login = ()=>{
    const dispatch = useDispatch()
    const {isAuth,error,id,isLoaded,login} = useSelector(({login})=>login)
    const [err,setErr] = useState('')
    const [reg_message,setReg_message] = useState('')
    const [loaded,setLoaded] = useState(true)
    const registerHandler = useCallback((event) =>{
        setErr('')
        setReg_message("")
        event.preventDefault()
        let body = {}
        for(let i=0; i< event.target.elements.length-1; i++){
           let e = event.target.elements[i]
           body[e.name] = e.value
        }

       for(let key in body){
           if(!body[key].trim()){
               setErr("Заполните все поля")
               return
           }
       }
       setLoaded(false)
       fetch("/register",{method:"POST",body:JSON.stringify(body),headers:{'Content-Type': 'application/json'}})
       .then(async data => {
           setLoaded(true)
           setReg_message(await data.text())
        })
    },[])
    const loginHandler = useCallback((event)=>{
        event.preventDefault()
        let body = {}
        for(let i=0; i< event.target.elements.length-1; i++){
            let e = event.target.elements[i]
            body[e.name] = e.value
         }
         for(let key in body){
            if(!body[key].trim()){
                setErr("Заполните все поля")
                return
            }
        }
        dispatch(actionLogin(body))
    },[])

    useEffect(() => {
        if(login) dispatch(actionAuth())
    },[login])
    return(
        <div className="container">
            {isAuth && <Redirect to={`/profile/${id}`}/>}
            <div className="login_page">
                <div className="info">
                    <h2>Flyx простой чат для переписки</h2>
                    <p>Создан для курсовой работы</p>
                </div>
                <div className="auth">
                    <div className="login">
                        <div style={{textAlign:"center"}}><h3>Войти</h3></div>
                        <form onSubmit={loginHandler}>
                            <input placeholder="email" name="email" />
                            <input placeholder="password" name="password" />
                            <button disabled={!isLoaded && true} type="submit">Войти</button>
                        </form>
                    </div>
                    <div className="register">
                    <div style={{textAlign:"center"}}><h3>Регистрация</h3></div>
                    <form onSubmit={registerHandler}>
                            <input type="email" placeholder="email" name="email" />
                            <input type="password" placeholder="password" name="password" />
                            <input placeholder="Имя" name="name" />
                            <input placeholder="Фамилия" name="surname" />
                            <div style={{display:"flex", alignItems:"center"}}>
                            <select style={{height:"30px"}} name="month" size="1" placeholder="0">
                                {month.map((val,i)=>(
                                    <option key={i}>{val}</option>
                                ))}
                            </select>
                            <input style={{width:"50px",height:"30px",border:"1px solid black"}} name="day" placeholder="День" type="text" maxLength="2"/>
                            <input style={{width:"50px",height:"30px",border:"1px solid black"}} name="year" placeholder="Год" type="text" maxLength="4"/>
                            
                            </div>
                            <button disabled={!loaded && true} type="submit">{loaded ? "Регистрация":"Загрузка"}</button>
                            <span style={{color:"red"}}>{err && err}</span>
                        </form>
                    </div>
                </div>
            <div className={`auth_message ${(reg_message||error) && "active_message"}`}>{(reg_message && reg_message) || (error && error)}<span onClick={(e)=>e.target.parentNode.classList.remove("active_message")} style={{marginLeft:"5px",color:"red",cursor:"pointer"}}>X</span></div>
            </div>
        </div>
    )
}

export default React.memo(Login)