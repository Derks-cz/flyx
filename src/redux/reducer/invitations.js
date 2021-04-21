const states = {
    invitesFrom:[],
    invitesTo:[],
    newInvite:null,
    acceptInvite:null,
  }

  function invitations(state=states,action) {
        switch(action.type){
            case "GET_INVITATION":
                return {...state, invitesFrom:action.payload.invitesFrom,invitesTo:action.payload.invitesTo}
            case "NEW_INVITE":
                return {...state,newInvite:action.payload.newInvite}
            case "ACCEPT_INVITE":
                return {...state,acceptInvite:action.payload}
            default:
                return state
        }
  }

export default invitations