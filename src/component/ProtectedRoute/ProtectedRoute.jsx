import { useContext } from 'react'
import { AuthContext } from '../Authcontext/Authcontext'
import { Navigate } from 'react-router'

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)
  return token ? children : <Navigate to="/login" />
}
