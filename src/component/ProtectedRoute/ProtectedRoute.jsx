import { useContext } from 'react'
import { AuthContext } from '../Authcontext/Authcontext'
import { Navigate } from 'react-router'

export default function ProtectedRoute({children}) {
  const {token} = useContext(AuthContext)
  if(token)
    {
       return(<Navigate to="/" /> , children)
    }
    else{
       return <Navigate to="/login"/>
    }
    
}
