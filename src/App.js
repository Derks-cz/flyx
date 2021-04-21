import "./styles/App.css"
import { Switch, Route, Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Dialogs from './pages/Dialogs'
import Chat from './pages/Chat'
import Friends from './pages/Friends'
import Content from './components/Content'
import NotFoundPage from "./pages/NotFoundPage"
import { actionAuth } from "./redux/action/actionLogin"
import { actionUser } from "./redux/action/actionUser"
import Header from "./components/Header"
import { useEffect, useState} from "react"


function App() {
  const dispatch = useDispatch()
  const [acceptedInvitation,setAcceptedInvitation] = useState("")
  const [removeFriend,setRemoveFriend] = useState("")
  const { isAuth} = useSelector(({ login }) => login)
  const {id} = useSelector(({user})=>user)
  useEffect(()=>{
    dispatch(actionAuth())
  },[dispatch])
  useEffect(() => {
    if (isAuth) {
      dispatch(actionUser())
    }
  }, [isAuth,acceptedInvitation,removeFriend,dispatch])
  return (
    <>
    <Header />
      {!isAuth ? (
        <Switch>
          <Route path="/" component={Login} />
        </Switch>
      ) : (
        <Content isAuth={isAuth} id={id} setAcceptedInvitation={setAcceptedInvitation} setRemoveFriend={setRemoveFriend}>
        <Switch>
          <Route exact path="/dialogs" component={Dialogs} />
          <Route  path="/dialogs/:id" component={Chat} />
          <Route path="/friends" component={Friends} />
          <Route path="/profile/:id" component={Profile} />
          <Redirect to={`/profile/${id?id:""}`}/>
        </Switch>
        </Content>
      )}
    </>
  )
}
export default App
