import AuthHero from '../../component/AuthHero/AuthHero'
import Signupform from '../../component/Signupform/Signupform'

export default function Signup() {
  return (
    <>
    <div className=" lg:grid lg:grid-cols-2">
      <AuthHero/>
      <Signupform/>
    </div>
    </>
  )
}
