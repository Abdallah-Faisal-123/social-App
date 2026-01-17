import AuthHero from '../../component/AuthHero/AuthHero'
import Loginform from '../../component/LoginForm/Loginform'

export default function Signup() {
  return (
    <>
    <div className=" lg:grid lg:grid-cols-2">
      <AuthHero/>
      <Loginform/>
    </div>
    </>
  )
}