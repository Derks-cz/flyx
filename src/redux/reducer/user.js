const states = {
  id: null,
  friends: [],
  invitesTo:[],
  dialogs:[],
  name: null,
  surname: null,
}
const defaultStates = {
  id: null,
  friends: [],
  invitesTo:[],
  dialogs:[],
  name: null,
  surname: null,
}


function user(state = states, action) {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        id: action.payload.id,
        invitesTo:action.payload.invitesTo,
        dialogs:action.payload.dialogs,
        chatPriority:action.payload.chatPriority,
        friends: action.payload.friends,
        name: action.payload.name,
        surname: action.payload.surname,
      }
    case "LOGOUT_USER":
      return defaultStates
    default:
      return state
  }
}

export default user
