const states = {
    found: true,
    loaded:true,
    id:"",
    friends:[],
    name: null,
    surname:null,
    brithday:{
        day:null,
        month:null,
        year:null
    }
}

const defaultStates = {
    found: true,
    loaded:true,
    id:"",
    friends:[],
    name: null,
    surname:null,
    brithday:{
        day:null,
        month:null,
        year:null
    }
}
function profile(state = states ,action){
    switch(action.type){
        case "GET_PROFILE":
            return {
                ...state,
                found:action.payload.found,
                loaded:true,
                id:action.payload.id,
                name:action.payload.name,
                friends:action.payload.friends,
                surname:action.payload.surname,
                brithday:{
                    day: action.payload.brithday.day,
                    month:action.payload.brithday.month,
                    year:action.payload.brithday.year
                }
            }
        case "NOT_FOUND":
            return {...state,found:action.payload.found}
        case "CLEAR_PROFILE":
            return defaultStates
        case "LOADED_PROFILE":
             return {...state,loaded:false}
        default:
            return state
    }
}

export default profile