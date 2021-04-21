import React from 'react'
import {Link} from 'react-router-dom'

const NotFoundPage = () =>{
    return (
        <div className="container">
            <h1>Вы не авторизованны, пройдите по ссылке и авторизуйтесь</h1>
           <Link to="/login">Войти</Link> 
        </div>
    )
}

export default NotFoundPage