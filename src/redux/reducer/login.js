const states = {
    id:'',
    isAuth:false,
    isLoaded:true,
    login:false,
    error:null
}
function login(state = states ,action){
    switch(action.type){
        case "SET_AUTH_STATE":
            return {...state,isAuth:action.payload.isAuth,id:action.payload.id}
        case "LOGIN":
            return {...state,error:action.payload.error,login:action.payload.login,isLoaded:true}
        case "LOGOUT":
            return {...state,isAuth:action.payload.isAuth,id:null,login:false}
        case "CLEAR_ERROR":
            return {...state,error:null}
        case "LOADED":
            return {...state,isLoaded:false}
        default:
            return state
    }
}

export default login