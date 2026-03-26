import Navbar from '../../component/Navbar/Navbar'
import Feed from '../../component/Feed/Feed'
import PeopleSidebar from '../../component/PeopleSidebar/PeopleSidebar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-2 sm:px-4 py-4 animate-fade-in-up">
        <div className="flex gap-5 items-start">

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            <Feed />
          </main>

          {/* People to Follow sidebar — visible on large screens only */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-20">
            <PeopleSidebar />
          </div>

        </div>
      </div>
    </div>
  )
}
