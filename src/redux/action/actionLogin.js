
export const login = (payload) => ({
    type: "LOGIN",
    payload
})
export const clearError = ()=>({
    type:"CLEAR_ERROR"
})
export const logOut =(payload) =>({
    type:"LOGOUT",
    payload
})

export const auth = (payload) =>({
    type:"SET_AUTH_STATE",
    payload
})

export const loaded = () =>({
    type:"LOADED"
})
const actionLogin = (body) =>{
    return (dispath)=>{
        dispath(clearError())
        dispath(loaded())
        fetch("/login",{method:"POST",body:JSON.stringify(body),headers:{'Content-Type': 'application/json'}})
        .then(async data => {
            const response = await data.json()
                dispath(login(response))
        })
        .catch((e)=> {throw new Error(e)})
    }
}

const actionLogOut = ()=>{
    return (dispath)=>{
        fetch("/logOut",{method:"POST"})
        .then(async data =>{dispath(logOut(await data.json()))})
    }
}

const actionAuth = ()=>{
    return (dispath)=>{
        fetch("/isAuth",{method:"POST"})
        .then(async (data)=> dispath(auth(await data.json())))
        .catch(e=> {throw new Error(e)})
    }
}

export {actionLogin, actionAuth,actionLogOut}