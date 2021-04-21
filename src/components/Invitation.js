import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'

const Invitation = ({invite,setRerender})=>{
    const dispatch = useDispatch()
    const acceptInvite = useCallback((id) =>{
        let body = {id}
        fetch("/friend/invite/accept",{method:"POST",body:JSON.stringify(body),headers:{'Content-Type': 'application/json'}})
        .then(async data => {
            let response = await data.text()
            dispatch({type:"ACCEPT_INVITE",payload:response})
            setRerender(response)
        })
    },[setRerender])
    const rejectInvite = useCallback((id) =>{
        let body={id}
        fetch("/friend/invite/reject",{method:"POST",body:JSON.stringify(body),headers:{'Content-Type': 'application/json'}})
        .then(async data => setRerender(await data.text()))
    },[setRerender])
    return(
        <div className="modal">
            <div className="modal_wrap">
                <div className="modal_content">
                    <div>
                        <h3>Заявки в друзья</h3>
                    </div>
                    {invite.length ? invite.map((obj)=>(
                        <div key={obj._id}  className="invitation">
                            <div className="info_invitation">
                               <Link className="link_to_friend" to={`/profile/${obj._id}`}>{obj.name} {obj.surname}</Link>
                            </div>
                            <div className="choice">
                                <span className="accept" onClick={()=>acceptInvite(obj._id)}>✔</span>
                                <span className="reject" onClick={()=>rejectInvite(obj._id)}>X</span>
                            </div>
                        </div>
                    )):"Приглашений нет"}
                </div>
            </div>
        </div>
    )
}

export default React.memo(Invitation)