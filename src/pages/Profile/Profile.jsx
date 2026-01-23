import React, { useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Navbar from '../../component/Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { AuthContext } from '../../component/Authcontext/Authcontext'
import ProfileLoading from '../../component/ProfileLoading/ProfileLoading'
import PostCard from '../../component/PostCard/PostCard'
import { toast } from 'react-toastify'
import FormField from '../../component/UI/FormField/FormField'

export default function Profile() {
  const { token } = useContext(AuthContext)
  const [userPosts, setUserPosts] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  async function getUserPosts(userId) {
    try {
      const options = {
        url: `https://linked-posts.routemisr.com/users/${userId}/posts`,
        method: 'GET',
        headers: { token }
      }

      const { data } = await axios.request(options)
      console.log("User Posts API Response:", data)
      setUserPosts(data.posts || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user posts:", error)
      setLoading(false)
    }
  }

  async function getProfileData() {
    try {
      const options = {
        url: `https://linked-posts.routemisr.com/users/profile-data`,
        method: 'GET',
        headers: { token }
      }

      const { data } = await axios.request(options)
      console.log("Profile Data API Response:", data)

      if (data.user) {
        setUserData(data.user)

        getUserPosts(data.user._id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)

      try {
        const decoded = jwtDecode(token);
        setUserData({
          name: decoded.name || "User",
          photo: "https://i.pravatar.cc/300?img=12"
        })
      } catch (e) {
        console.error("Token decode fallback failed:", e)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getProfileData()
    } else {
      setLoading(false)
    }
  }, [token])

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return


    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large (max: 5MB)')
      return
    }

    const supportedTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
    if (!supportedTypes.includes(file.type)) {
      toast.error('Only image files are allowed')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('photo', file)

      const options = {
        url: `https://linked-posts.routemisr.com/users/upload-photo`,
        method: 'PUT',
        headers: { token },
        data: formData
      }

      const { data } = await axios.request(options)
      console.log("Upload Photo Full Response:", data)


      const isSuccess = data.message?.toLowerCase() === "success" || !!data.user || !!data.photo

      if (isSuccess) {
        if (data.user) {
          setUserData(data.user)
          if (data.user._id) getUserPosts(data.user._id)
        } else if (data.photo) {
          setUserData(prev => ({ ...(prev || {}), photo: data.photo }))
        } else if (data._id && data.photo) {
          // Case where data is the user object itself
          setUserData(data)
          getUserPosts(data._id)
        }
        toast.success("Profile photo updated successfully!")
        getProfileData()
      } else {
        console.warn("Upload reported success but data structure was unexpected:", data)
      }
    } catch (error) {
      console.error("Upload error details:", error.response || error)
      const errorMsg = error.response?.data?.message || "Failed to update profile photo."
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <ProfileLoading />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-['Roboto']">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-2 sm:px-4">

        <div className="relative">
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-xl sm:rounded-b-2xl overflow-hidden shadow-lg">
          </div>


          <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-4 sm:left-6 md:left-8">
            <div className="relative group">
              <img
                src={userData?.photo || "https://i.pravatar.cc/300?img=12"}
                alt={userData?.name}
                className="size-24 sm:size-28 md:size-32 rounded-full border-2 sm:border-4 border-white shadow-xl bg-white object-cover"
              />
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <FontAwesomeIcon icon={faSpinner} className="text-white text-xl md:text-2xl animate-spin" />
                </div>
              ) : (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-blue-600 transition cursor-pointer transform hover:scale-110">
                  <FontAwesomeIcon icon={faCamera} className="text-xs sm:text-sm -mb-2" />
                  <FormField
                    elementType={'file'}
                    type={'file'}
                    id={'image'}
                    className={'hidden'}
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mt-14 sm:mt-16 md:mt-20 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{userData?.name || "User"}</h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">@{userData?.name?.toLowerCase().replace(/\s+/g, '') || "user"}</p>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 md:gap-10 mt-4 sm:mt-6 md:mt-8">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{userPosts?.length || 0}</p>
                  <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">Posts</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-bold hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white lg:px-25 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8  md:mb-12 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button className="flex-1 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base font-bold text-blue-600 border-b-2 sm:border-b-4 border-blue-600 bg-blue-50/30">
              Posts
            </button>
            <button className="flex-1 py-3 sm:py-4 md:py-5 text-center text-sm sm:text-base font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition border-b-2 sm:border-b-4 border-transparent">
              Media
            </button>
          </div>

          {/* Posts Content */}
          <div className=" sm:p-6 md:p-8 bg-gray-50/50  sm:mx-0 md:mx-11">
            {userPosts && userPosts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {[...userPosts].reverse().map((post) => (
                  <PostCard key={post._id} postInfo={post} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12 sm:py-16 md:py-20 flex flex-col items-center">
                <div className="bg-white p-4 sm:p-6 rounded-full shadow-md mb-3 sm:mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-3xl sm:text-4xl text-gray-200" />
                </div>
                <p className="text-lg sm:text-xl font-bold text-gray-500">No posts yet</p>
                <p className="text-xs sm:text-sm mt-2 max-w-xs mx-auto px-4">When you share thoughts, they'll appear here on your profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
