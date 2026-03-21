import { faBell, faHeart, faImage, faMessage, faStar, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import backgroundimg from '../../assets/pngtree-close-up-view-of-social-media-app-logos-in-square-shape-image_3631509.jpg'
import avatar from '../../assets/R.png'

export default function AuthHero() {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center p-4 md:p-6"
      style={{
        backgroundImage: `url(${backgroundimg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-purple-900/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-6xl">
        <p className="pt-8 pl-4 text-white text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="bg-white/10 backdrop-blur-xl py-2.5 px-4 rounded-2xl border border-white/10 text-indigo-300 font-black">S</span>
          <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">SocialHup</span>
        </p>

        <div className="p-4 md:p-5 mt-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">Connect With</h1>

          <h2 className="text-3xl md:text-5xl lg:text-6xl py-2 font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
            amazing people
          </h2>

          <p className="max-w-lg text-white/70 py-3 text-base md:text-lg leading-relaxed">
            Join millions of users sharing moments, ideas, and building meaningful connections every day.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 md:my-10">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300 group cursor-default">
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faMessage} className="text-cyan-400 text-lg" />
              </span>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">Real-time chat</h4>
                <span className="text-white/50 text-xs md:text-sm">Instant Messages</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300 group cursor-default">
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faImage} className="text-blue-400 text-lg" />
              </span>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">Share Media</h4>
                <span className="text-white/50 text-xs md:text-sm">Photos and Videos</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300 group cursor-default">
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400/20 to-violet-500/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faBell} className="text-purple-400 text-lg" />
              </span>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">Smart Alerts</h4>
                <span className="text-white/50 text-xs md:text-sm">Stay updated</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:bg-white/[0.12] transition-all duration-300 group cursor-default">
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-emerald-400 text-lg" />
              </span>
              <div>
                <h4 className="text-white font-semibold text-sm md:text-base">Communities</h4>
                <span className="text-white/50 text-xs md:text-sm">Find your tribe</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-white">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-indigo-400 text-xl" /> 2M+
              </p>
              <span className="text-white/50 text-sm font-medium">Active Users</span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-rose-400 text-xl" /> 10M+
              </p>
              <span className="text-white/50 text-sm font-medium">Posts Shared</span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <FontAwesomeIcon icon={faMessage} className="text-cyan-400 text-xl" /> 50M+
              </p>
              <span className="text-white/50 text-sm font-medium">Messages Sent</span>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mx-auto text-start mt-8 md:mt-10 p-6 max-w-md bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/10">
          <div className="text-amber-400 flex gap-1">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>

          <p className="py-4 text-white/70 text-start text-sm md:text-base leading-relaxed">
            "SocialHup has transformed how I connect with friends and colleagues. The interface is beautiful and incredibly intuitive!"
          </p>

          <div className="flex items-center gap-4 text-white">
            <img src={avatar} className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10" alt="" />
            <div className="text-left">
              <p className="font-bold text-sm">Abdallah Faisal</p>
              <span className="text-xs text-white/50">Web Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
