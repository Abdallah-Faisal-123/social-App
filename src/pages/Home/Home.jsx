
import Navbar from '../../component/Navbar/Navbar'
import Feed from '../../component/Feed/Feed'
import UploadPoast from '../../component/UploadPost/UploadPoast'

export default function Home() {
  return (
    <div className="min-h-screen ">
      <Navbar />

      <div><Feed /></div>
    </div>
  )
}
