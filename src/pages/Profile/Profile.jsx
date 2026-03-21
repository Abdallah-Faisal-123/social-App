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
        url: `https://route-posts.routemisr.com/users/${userId}/posts`,
        method: 'GET',
         headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.request(options)
      setUserPosts(data.data.posts || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user posts:", error)
      setLoading(false)
    }
  }

  async function getProfileData() {
    try {
      const options = {
        url: `https://route-posts.routemisr.com/users/profile-data`,
        method: 'GET',
         headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.request(options)
      if (data.data.user) {
        setUserData(data.data.user)
        getUserPosts(data.data.user._id)
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
        url: `https://route-posts.routemisr.com/users/upload-photo`,
        method: 'PUT',
         headers:{
          Authorization: `Bearer ${token}`
        },
        data: formData
      }

      const { data } = await axios.request(options)

      const isSuccess = data.success === true || !!data.data.user || !!data.data.photo

      if (isSuccess) {
        if (data.data.user) {
          setUserData(data.data.user)
          if (data.data.user._id) getUserPosts(data.data.user._id)
        } else if (data.data.photo) {
          setUserData(prev => ({ ...(prev || {}), photo: data.data.photo }))
        } else if (data.data._id && data.data.photo) {
          setUserData(data)
          getUserPosts(data.data._id)
        }
        toast.success("Profile photo updated successfully!")
        getProfileData()
      }
    } catch (error) {
      const errorMsg = error.response?.data.data?.message || "Failed to update profile photo."
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-2 sm:px-4 animate-fade-in-up">

        {/* Cover Photo */}
        <div className="relative">
          <div className="h-44 sm:h-52 md:h-60 lg:h-72 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 rounded-b-3xl overflow-hidden shadow-xl animate-gradient">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-14 sm:-bottom-16 md:-bottom-18 left-4 sm:left-6 md:left-8">
            <div className="relative group">
              <div className="p-1 bg-white rounded-full shadow-xl">
                <img
                  src={userData?.photo || "https://i.pravatar.cc/300?img=12"}
                  alt={userData?.name}
                  className="size-24 sm:size-28 md:size-32 rounded-full bg-white object-cover"
                />
              </div>
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <FontAwesomeIcon icon={faSpinner} className="text-white text-xl md:text-2xl animate-spin" />
                </div>
              ) : (
                <label className="absolute bottom-1 right-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg shadow-indigo-300 hover:scale-110 transition-transform cursor-pointer">
                  <FontAwesomeIcon icon={faCamera} className="text-xs" />
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
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100/80 mt-16 sm:mt-18 md:mt-22 p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{userData?.name || "User"}</h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">@{userData?.name?.toLowerCase().replace(/\s+/g, '') || "user"}</p>

              {/* Stats */}
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{userPosts?.length || 0}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Posts</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-7 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-95 cursor-pointer">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100/80 mt-4 sm:mt-6 mb-8 md:mb-12 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button className="flex-1 py-3.5 sm:py-4 text-center text-sm font-bold text-indigo-600 border-b-[3px] border-indigo-500 bg-indigo-50/40">
              Posts
            </button>
          </div>

          {/* Posts Content */}
          <div className="p-3 sm:p-5 md:p-6 bg-slate-50/30">
            {userPosts && userPosts.length > 0 ? (
              <div className="flex flex-col gap-4 max-w-2xl mx-auto stagger-children">
                {[...userPosts].reverse().map((post) => (
                  <PostCard key={post._id} postInfo={post} />
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-16 md:py-24 flex flex-col items-center animate-fade-in-up">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-3xl text-indigo-300" />
                </div>
                <p className="text-lg font-bold text-slate-500">No posts yet</p>
                <p className="text-sm mt-2 max-w-xs mx-auto text-slate-400">When you share thoughts, they'll appear here on your profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
