import React from 'react'
import Navigation from '../components/Navigation'
import FriendList from '../components/FriendList'
import { useSelector} from 'react-redux'
import avatar from '../images/default/avatar.jpg'
import {Link} from 'react-router-dom'
const Dialogs = () =>{
    const user = useSelector(({user})=>user)
    const {id} = useSelector(({login})=>login)
    return (
        <div className="container">
            <div className="dialogs">
             <div className="profile_links">
                    <Navigation id={id} />
                    <FriendList user={user} />
                </div>
                <div className="all_dialogs">
                    <h3 style={{textAlign:"center",marginBottom:"10px"}}>Диалоги</h3>
                    <div className="dialogs_list">
                        {user.dialogs.map(obj=>(
                            <Link key={obj._id} to={`/dialogs/${obj._id}`} className="dialog">
                            <img style={{width:"30px",borderRadius:"100%",marginRight:"5px"}} src={avatar} alt="avatart" />
                            <div>{obj.name} {obj.surname}</div>
                           </Link> 
                        ))}              
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Dialogs)