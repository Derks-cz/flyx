export const getProfile = (payload) =>({
    type:"GET_PROFILE",
    payload
})

export const notFound = (payload)=>({
    type:"NOT_FOUND",
    payload
})
export const loadedProfile = () =>({
    type:"LOADED_PROFILE"
})

function actionProfile(id) {
    return (dispatch)=>{
        dispatch(loadedProfile())
        fetch(`/profile?id=${id}`)
        .then(async (data)=> {
            if(data.ok){
            dispatch(getProfile(await data.json()))
          }
          else {
              dispatch(notFound(await data.json()))
          }
        })
        .catch((e)=> {throw new Error(e)})
    }
}
export {actionProfile}