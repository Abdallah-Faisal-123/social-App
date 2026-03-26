import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Navbar from '../../component/Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { AuthContext } from '../../component/Authcontext/Authcontext'
import ProfileLoading from '../../component/ProfileLoading/ProfileLoading'
import PostCard from '../../component/PostCard/PostCard'
import FollowButton from '../../component/FollowButton/FollowButton'

export default function UserProfile() {
  const { id } = useParams()
  const { token, setToken } = useContext(AuthContext)
  
  const [userPosts, setUserPosts] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getProfileData() {
    setLoading(true)
    try {
      // 1. Fetch user info (assuming this gives user details in data.data.user)
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/${id}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const user = data?.user || data?.data?.user || data?.data || data;
      setUserData(user)
      
      // 2. Fetch user's posts
      const postsRes = await axios.get(
        `https://route-posts.routemisr.com/users/${id}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setUserPosts(postsRes.data?.data?.posts || [])
      
    } catch (error) {
      console.error("Error fetching generic profile data:", error)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && id) {
      getProfileData()
    } else {
      setLoading(false)
    }
  }, [token, id])

  if (loading) {
    return (
      <>
        <Navbar />
        <ProfileLoading />
      </>
    )
  }

  if (!userData) {
     return (
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <div className="flex justify-center items-center h-full pt-32">
             <h2 className="text-xl font-bold text-gray-400">User not found</h2>
          </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-2 sm:px-4 animate-fade-in-up">

        {/* Cover Photo */}
        <div className="relative">
          <div className="h-44 sm:h-52 md:h-60 lg:h-72 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-400 rounded-b-3xl overflow-hidden shadow-xl animate-gradient">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-14 sm:-bottom-16 md:-bottom-18 left-4 sm:left-6 md:left-8">
            <div className="relative group">
              <div className="p-1 bg-white rounded-full shadow-xl">
                <img
                  src={userData?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "U")}&background=6366f1&color=fff`}
                  alt={userData?.name}
                  className="size-24 sm:size-28 md:size-32 rounded-full bg-white object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100/80 mt-16 sm:mt-18 md:mt-22 p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{userData?.name || "Unknown User"}</h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">@{userData?.name?.toLowerCase().replace(/\s+/g, '') || "user"}</p>

              {/* Stats */}
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{userPosts?.length || 0}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">Posts</p>
                </div>
              </div>
            </div>

            {/* Action Button: Follow */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
               <FollowButton targetUserId={id} className="w-full sm:w-auto px-10 py-3 text-sm md:text-base" />
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
                 {/* Reusing PostCard component to show the user's posts */}
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
                <p className="text-sm mt-2 max-w-xs mx-auto text-slate-400">This user hasn't shared any posts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
