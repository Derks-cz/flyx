export const getInvitations = (payload) =>({
    type:"GET_INVITATION",
    payload
})

function actionInvitations() {
    return (dispatch)=>{
        fetch("/invitations")
        .then(async data =>{
            if(data.ok) dispatch(getInvitations(await data.json()))
            else dispatch(getInvitations(await data.text()))
        })
    }
}

export {actionInvitations}