import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots, faHeart, faThumbsUp, faShareNodes, faEllipsisVertical, faTrash, faEdit, faCheck, faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { faThumbsUp as ThumbsUpRegular } from "@fortawesome/free-regular-svg-icons"
import { faThumbsUp as LikesIcon } from "@fortawesome/free-solid-svg-icons"
import Commentcard from "../Commentcard/Commentcard"
import { Link } from "react-router"
import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../Authcontext/Authcontext"
import axios from "axios"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"

export default function PostCard({ postInfo, commentsLimit = 3, onPostDeleted }) {
  const { token } = useContext(AuthContext)
  const [comments, setComments]     = useState([])
  const [likesCount, setLikesCount] = useState(0) // Defaulting to 0 since we might not have postInfo.likes array directly
  const [isLiked, setIsLiked]       = useState(false)
  
  // Post states
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing]   = useState(false)
  const [editBody, setEditBody]     = useState(postInfo.body)
  const [isSaving, setIsSaving]     = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Auth: find the user ID across different possible JWT payload structures
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id || decoded._id || decoded.user || decoded.userId || null;
    } catch (e) {
      console.error("Token decoding failed", e);
    }
  }

  const menuRef = useRef(null)

  useEffect(() => {
    // Close dropdown on click outside
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuRef])

  async function getAllComments() {
    try {
      const options = {
        url: `https://route-posts.routemisr.com/posts/${postInfo._id}/comments?page=1`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
      const { data } = await axios.request(options)
      setComments(data.data.comments || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllComments()
    // Initialize likes (Fallback if postInfo doesn't explicitly give likes array)
    // If postInfo.likes exists, we use its length.
    if (postInfo.likes && Array.isArray(postInfo.likes)) {
        setLikesCount(postInfo.likes.length)
        if (postInfo.likes.includes(currentUserId)) setIsLiked(true)
    }
  }, [postInfo, currentUserId])

  // --- ACTIONS ---

  // 1. Like Post
  async function handleLike() {
    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic UI update
    setIsLiked(!previousLiked)
    setLikesCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1)

    try {
      await axios.put(`https://route-posts.routemisr.com/posts/${postInfo._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      // Revert optimistic update
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
      toast.error(error.response?.data?.message || "Failed to like post.")
    }
  }

  // 2. Share Post
  async function handleShare() {
    try {
      const { data } = await axios.post(`https://route-posts.routemisr.com/posts/${postInfo._id}/share`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(data.message || "Post shared successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to share post.")
    }
  }

  // 3. Update Post
  async function handleUpdate() {
    if (!editBody.trim()) return toast.error("Post cannot be empty.");
    setIsSaving(true)
    try {
      // The API expects FormData
      const formData = new FormData()
      formData.append('body', editBody)

      await axios.put(`https://route-posts.routemisr.com/posts/${postInfo._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      postInfo.body = editBody // mutate locally for immediate update without refetch
      setIsEditing(false)
      toast.success("Post updated!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post.")
    } finally {
      setIsSaving(false)
    }
  }

  // 4. Delete Post
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true)
    try {
      await axios.delete(`https://route-posts.routemisr.com/posts/${postInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Post deleted!")
      if (onPostDeleted) onPostDeleted(postInfo._id)
      else window.location.reload() // Fallback if no handler provided
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post.")
      setIsDeleting(false)
    }
  }

  if (isDeleting) {
    return (
      <div className="my-3 md:my-4 bg-white rounded-2xl md:rounded-3xl mx-2 md:mx-0 border border-slate-100/80 p-8 flex items-center justify-center text-slate-400">
         <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3 text-2xl" /> Deleting post...
      </div>
    )
  }

  return (
    <>
      <div className="my-3 md:my-4 bg-white rounded-2xl md:rounded-3xl mx-2 md:mx-0 animate-fade-in-up overflow-hidden border border-slate-100/80">
        <div className="shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl md:rounded-3xl">
          
          {/* Post Header */}
          <header className="p-4 md:p-5 flex items-start justify-between">
            <div className="flex items-center">
              <div className="relative group">
                <img src={postInfo.user.photo} alt={postInfo.user.name} className="size-11 md:size-12 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all duration-200" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="ms-3">
                <Link to={`/user/${postInfo.user._id}`} className="block">
                  <p className="font-bold text-sm md:text-base text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer">{postInfo.user.name}</p>
                </Link>
                <Link to={`/postdetails/${postInfo._id}`}>
                  <span className="text-xs text-slate-400 hover:text-indigo-500 transition-colors font-medium">
                    {new Date(postInfo.createdAt).toLocaleString()}
                  </span>
                </Link>
              </div>
            </div>

            {/* Menu Options (Edit/Delete) - Only visible if current user is the post author */}
            {currentUserId === postInfo.user._id && (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <FontAwesomeIcon icon={faEllipsisVertical} className="text-lg px-1.5" />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 top-10 mt-1 w-36 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-10 animate-fade-in-up py-1 flex flex-col">
                    <button onClick={() => { setIsEditing(true); setIsMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                       <FontAwesomeIcon icon={faEdit} className="text-xs" /> Edit 
                    </button>
                    <button onClick={() => { handleDelete(); setIsMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2">
                       <FontAwesomeIcon icon={faTrash} className="text-xs" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Post Body */}
          <div className="mb-1 text-sm md:text-[15px] text-slate-700 leading-relaxed px-4 md:px-5">
            {isEditing ? (
              <div className="w-full bg-slate-50 border border-indigo-200 rounded-xl p-3 shadow-inner">
                <textarea 
                  value={editBody} 
                  onChange={(e) => setEditBody(e.target.value)} 
                  rows="3" 
                  autoFocus 
                  className="w-full bg-transparent border-none outline-none resize-none text-slate-700 placeholder-slate-400 focus:ring-0 font-medium" 
                />
                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-indigo-100">
                   <button onClick={() => { setIsEditing(false); setEditBody(postInfo.body) }} disabled={isSaving} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                     Cancel
                   </button>
                   <button onClick={handleUpdate} disabled={isSaving} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-colors flex items-center gap-1">
                     {isSaving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Save"}
                   </button>
                </div>
              </div>
            ) : (
               postInfo.body
            )}
          </div>

          {/* Post Image */}
          {postInfo.image && !isEditing && (
            <div className="mt-3 overflow-hidden">
              <img 
                src={postInfo.image} 
                alt="" 
                className="max-h-[480px] w-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer" 
              />
            </div>
          )}

          {/* Reactions Bar */}
          {!isEditing && (
            <div className="py-2.5 mx-4 md:mx-5 flex justify-between text-xs md:text-sm text-slate-400 border-b border-slate-50">
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-[10px]">
                  <FontAwesomeIcon icon={LikesIcon} />
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white text-[10px]">
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <p className="ml-1 font-medium">{likesCount} Likes</p>
              </div>
              <div>
                <p className="font-medium hover:text-indigo-500 transition-colors cursor-pointer">{postInfo.commentsCount} comments</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div className="py-1.5 flex justify-around">
              <button onClick={handleLike} className={`w-1/3 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group ${isLiked ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                <FontAwesomeIcon icon={isLiked ? faThumbsUp : ThumbsUpRegular} className="text-lg group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              <Link to={`/postdetails/${postInfo._id}`} className="w-1/3 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
                <FontAwesomeIcon icon={faCommentDots} className="text-lg group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Comment</span>
              </Link>
              <button onClick={handleShare} className="w-1/3 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
                <FontAwesomeIcon icon={faShareNodes} className="text-lg group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-3 px-4 md:px-5 pt-2 pb-4">
            {comments.length > 0 ? comments.slice(0, commentsLimit).map((comment) => <Commentcard key={comment._id} commentInfo={comment} postInfo={postInfo} />) :
              <div className="text-slate-400 text-sm text-center py-4">
                <p className="font-medium">No comments yet. Be the first to comment!</p>
              </div>}
            {comments.length > 3 ?
              <div className="pt-2 text-center">
                <Link to={`/postdetails/${postInfo._id}`} className="text-indigo-500 hover:text-indigo-700 font-semibold text-sm transition-colors">
                  Show all comments →
                </Link>
              </div>
              : ''}
          </div>

        </div>
      </div>
    </>
  )
}
