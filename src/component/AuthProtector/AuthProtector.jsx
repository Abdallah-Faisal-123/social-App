import { useContext } from 'react'
import { AuthContext } from '../Authcontext/Authcontext'
import { Navigate } from 'react-router'

export default function AuthProtector({children}) {
  const {token} = useContext(AuthContext)
  if(token)
    {
      return<Navigate to="/" /> 
    }
    else{
       return children
    }
    
}
