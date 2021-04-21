import React, { useCallback, useState } from 'react'
import {Link} from 'react-router-dom'
import Navigation from '../components/Navigation'
import FriendList from '../components/FriendList'
import {useSelector} from 'react-redux'
import avatar from '../images/default/avatar.jpg'
const Friends = ()=>{
    const {id} = useSelector(({login})=>login)
    const user = useSelector(({user})=>user)
    const [foundUsers,setFoundUsers] = useState([])

    const findUser = useCallback((e)=>{
        e.preventDefault()
        if(e.target.elements[0].value.trim()){
          let query = e.target.elements[0].value.trim()
          setFoundUsers([])
          fetch("/user/find",{method:"POST",body:JSON.stringify({find:query}),headers:{'Content-Type': 'application/json'}})
          .then(async data=>{
            setFoundUsers(await data.json())  
          })
          e.target.elements[0].value = ""
        }   
    },[])
    return(
        <div className="container">
            <div className="profile">
            <div className="profile_links">
                    <Navigation id={id} />
                    <FriendList user={user} />
                </div>
                <div className="find_friend">
                    <div className="input_find">
                        <form onSubmit={findUser} className="form_find_friend">
                            <input type="text" placeholder="Поиск друзей" />
                            <button type="submit">Поиск</button>
                        </form>
                    </div>
                    <div className="found_users">
                        {foundUsers && foundUsers.map(user=>(
                            <div key={user._id} className="found_user">
                                <img src={avatar} alt="avatar" style={{borderRadius:"100%",width:"30px",height:"30px"}} />
                                <Link to={`/profile/${user._id}`}>{user.name} {user.surname}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Friends)