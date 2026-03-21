import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots, faHeart, faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import { faShareNodes, faThumbsUp as Likes } from "@fortawesome/free-solid-svg-icons"
import Commentcard from "../Commentcard/Commentcard"
import { Link } from "react-router"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Authcontext/Authcontext"
import axios from "axios"

export default function PostCard({ postInfo, commentsLimit = 3 }) {
  
    const { token } = useContext(AuthContext)
   const [comments,setComments] = useState([])
     async function getAllComments() {
    try {
      const options = {
        url: `https://route-posts.routemisr.com/posts/${postInfo._id}/comments?page=1`,
        method: 'GET',
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const{data} = await axios.request(options)
      setComments(data.data.comments)
      
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllComments()
  }, [])

  return (<>
    <div className="my-3 md:my-4 bg-white rounded-2xl md:rounded-3xl mx-2 md:mx-0 animate-fade-in-up overflow-hidden border border-slate-100/80">
      <div className="shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl md:rounded-3xl">
        
        {/* Post Header */}
        <header className="p-4 md:p-5">
          <div className="flex items-center">
            <div className="relative group">
              <img src={postInfo.user.photo} alt={postInfo.user.name} className="size-11 md:size-12 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all duration-200" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white"></div>
            </div>
            <div className="ms-3">
              <p className="font-bold text-sm md:text-base text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer">{postInfo.user.name}</p>
              <Link to={`postdetails/${postInfo._id}`}>
                <span className="text-xs text-slate-400 hover:text-indigo-500 transition-colors font-medium">
                  {new Date(postInfo.createdAt).toLocaleString()}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Post Body */}
        <div className="mb-1 text-sm md:text-[15px] text-slate-700 leading-relaxed px-4 md:px-5">
          {postInfo.body}
        </div>

        {/* Post Image */}
        {postInfo.image && (
          <div className="mt-3 overflow-hidden">
            <img 
              src={postInfo.image} 
              alt="" 
              className="max-h-[480px] w-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer" 
            />
          </div>
        )}

        {/* Reactions Bar */}
        <div className="py-2.5 mx-4 md:mx-5 flex justify-between text-xs md:text-sm text-slate-400 border-b border-slate-50">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-[10px]">
              <FontAwesomeIcon icon={Likes} />
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white text-[10px]">
              <FontAwesomeIcon icon={faHeart} />
            </span>
            <p className="ml-1 font-medium">0 Likes</p>
          </div>
          <div>
            <p className="font-medium hover:text-indigo-500 transition-colors cursor-pointer">{postInfo.commentsCount} comments</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="py-1.5 flex justify-around">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
            <FontAwesomeIcon icon={faThumbsUp} className="text-lg group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Like</span>
          </button>
          <Link to={`postdetails/${postInfo._id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
            <FontAwesomeIcon icon={faCommentDots} className="text-lg group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Comment</span>
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
            <FontAwesomeIcon icon={faShareNodes} className="text-lg group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-3 px-4 md:px-5 pt-2 pb-4">
          {comments.length > 0 ? comments.slice(0, commentsLimit).map((comment) => <Commentcard key={comment._id} commentInfo={comment} postInfo={postInfo} />) :
            <div className="text-slate-400 text-sm text-center py-4">
              <p className="font-medium">No comments yet. Be the first to comment!</p>
            </div>}
          {comments.length > 3 ?
            <div className="pt-2 text-center">
              <Link to={`postdetails/${postInfo._id}`} className="text-indigo-500 hover:text-indigo-700 font-semibold text-sm transition-colors">
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
