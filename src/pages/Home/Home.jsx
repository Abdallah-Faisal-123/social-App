
import Navbar from '../../component/Navbar/Navbar'
import Feed from '../../component/Feed/Feed'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="animate-fade-in-up">
        <Feed />
      </div>
    </div>
  )
}
