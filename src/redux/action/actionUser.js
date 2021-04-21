export const getUser = (payload)=>({
    type:"GET_USER",
    payload
})

function actionUser() {
    return (dispatch)=>{
        fetch("/user")
        .then(async data=>{
            dispatch(getUser(await data.json()))
        })
    } 
}



export {actionUser}