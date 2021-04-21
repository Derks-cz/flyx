import {createStore,applyMiddleware,combineReducers} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
import loginReducer from './reducer/login'
import profileReducer from './reducer/profile'
import userReducer from './reducer/user'
import invitationsReducer from './reducer/invitations'
const rootReducer = combineReducers({login:loginReducer,profile:profileReducer,user:userReducer,invite:invitationsReducer})
const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(thunk)))
export {store}