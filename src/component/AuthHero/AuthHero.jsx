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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-6xl">
        <p className="pt-8 pl-4 text-white text-2xl md:text-3xl font-semibold">
          <span className="backdrop-blur-xl py-2 px-5 rounded-2xl">S</span> SocialHup
        </p>

        <div className="p-4 md:p-5">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Connect With</h1>

          <h2 className="text-3xl md:text-5xl py-2 font-bold bg-linear-to-r from-cyan-200 to-black bg-clip-text text-transparent">
            amazing people
          </h2>

          <p className="max-w-lg text-white py-2 text-base md:text-lg">
            Join millions of users sharing moments, ideas, and building meaningful connections every day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-10">
            <div className="relative w-full p-5 rounded-xl backdrop-blur-2xl bg-white/20">
              <span className="bg-cyan-300/50 rounded-xl p-3">
                <FontAwesomeIcon icon={faMessage} className="text-cyan-500" />
              </span>
              <div className="absolute text-white/70 left-20 top-1">
                <h4 className="text-lg md:text-xl">Real-time chat</h4>
                <span>Instant Messages</span>
              </div>
            </div>

            <div className="relative w-full p-5 rounded-xl backdrop-blur-2xl bg-white/20">
              <span className="bg-blue-400/50 rounded-xl p-3">
                <FontAwesomeIcon icon={faImage} className="text-blue-600" />
              </span>
              <div className="absolute text-white/70 left-20 top-1">
                <h4 className="text-lg md:text-xl">Share Media</h4>
                <span>Photos and Videos</span>
              </div>
            </div>

            <div className="relative w-full p-5 rounded-xl backdrop-blur-2xl bg-white/20">
              <span className="bg-purple-500/50 rounded-xl p-3">
                <FontAwesomeIcon icon={faBell} className="text-purple-700" />
              </span>
              <div className="absolute text-white/70 left-20 top-1">
                <h4 className="text-lg md:text-xl">Smart Alerts</h4>
                <span>Stay updated</span>
              </div>
            </div>

            <div className="relative w-full p-5 rounded-xl backdrop-blur-2xl bg-white/20">
              <span className="bg-green-300/40 rounded-xl p-3">
                <FontAwesomeIcon icon={faMessage} className="text-green-400" />
              </span>
              <div className="absolute text-white/70 left-20 top-1">
                <h4 className="text-lg md:text-xl">Communities</h4>
                <span>Find your tribe</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-white">
            <div>
              <p className="text-xl md:text-2xl font-bold">
                <FontAwesomeIcon icon={faUsers} className="text-blue-400" /> 2M+
              </p>
              <span>Active Users</span>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-bold">
                <FontAwesomeIcon icon={faHeart} className="text-red-400" /> 10M+
              </p>
              <span>Posts Shared</span>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-bold">
                <FontAwesomeIcon icon={faMessage} className="text-blue-500" /> 50M+
              </p>
              <span>Messages Sent</span>
            </div>
          </div>
        </div>

        <div className="mx-auto text-start mt-10 p-6 max-w-md backdrop-blur-2xl rounded-2xl ">
          <div className="text-yellow-500">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>

          <p className="py-4 text-white text-start  md:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti nemo corporis, veniam quisquam eaque repudiandae?
          </p>

          <div className="flex items-center  gap-4 text-white">
            <img src={avatar} className="w-12 h-12 rounded-full" alt="" />
            <div className="text-left">
              <p className="font-bold">Abdallah Faisal</p>
              <span className="text-sm">Web Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
