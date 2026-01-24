import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots, faHeart, faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import { faA, faShareNodes, faThumbsUp as Likes } from "@fortawesome/free-solid-svg-icons"
import Commentcard from "../Commentcard/Commentcard"
import { Link, Navigate } from "react-router"
import Addcomment from "../Addcomment/Addcomment"

export default function PostCard({ postInfo, commentsLimit = 3 }) {

  return (<>
    <div className="my-3 md:my-5 bg-white rounded-xl md:rounded-2xl mx-2 md:mx-0">

      <div className="shadow-lg md:shadow-2xl rounded-xl md:rounded-2xl py-2 md:py-3">
        <header className="p-2 md:p-2.5">
          <div className="flex">
            <img src={postInfo.user.photo} alt="" className="size-10 md:size-12 rounded-full" />
            <div className="ms-2">
              <p className="font-semibold text-base md:text-lg">{postInfo.user.name}</p>
              <Link to={`postdetails/${postInfo._id}`}><span className="text-xs md:text-sm text-gray-600">{new Date(postInfo.createdAt).toLocaleString()}</span></Link>
            </div>
          </div>
          
          <div className=""></div>
        </header>
        <div className=" mb-4 md:mb-2 text-sm md:text-base text-gray-700 px-2 md:px-2.5">
          {postInfo.body}
        </div>
        {postInfo.image && <img src={postInfo.image} alt="" className="max-h-70 w-full size-100 object-fit" />}
        <div className="py-1 mx-2 flex justify-between text-xs md:text-sm">
          <div className="flex">
            <span className="rounded-full bg-blue-500 p-px text-amber-300"><FontAwesomeIcon icon={Likes} /></span>
            <span className="rounded-full bg-red-500 p-px"><FontAwesomeIcon icon={faHeart} /></span>
            <p className="mx-1">0 Likes</p>
          </div>
          <div>
            <p>{postInfo.comments.length} comments</p>
          </div>
        </div>
        <div className="py-3 md:py-4 flex justify-around text-sm md:text-base">
          <span className="cursor-pointer hover:text-blue-600 transition"><FontAwesomeIcon icon={faThumbsUp} className="text-lg md:text-xl mr-1" />Like</span>
          <Link to ={`postdetails/${postInfo._id}`} className="cursor-pointer hover:text-blue-600 transition"><FontAwesomeIcon icon={faCommentDots} className="text-lg md:text-xl mr-1" />Comment</Link>
          <span className="cursor-pointer hover:text-blue-600 transition"><FontAwesomeIcon icon={faShareNodes} className="text-lg md:text-xl mr-1" />Share</span>
        </div>
        <div className="space-y-3 md:space-y-4 px-4 md:px-11 pt-3 md:pt-5">
          {postInfo.comments.length > 0 ? postInfo.comments.slice(0, commentsLimit).map((comment) => <Commentcard key={comment._id} commentInfo={comment} />) :
            <div className="text-gray-500 text-sm md:text-base">
              <p className="mx-4 md:mx-20 py-4 md:py-5">No comments yet. Be the first to comment!</p>
            </div>}
          {postInfo.comments.length > 3 ?
            <div className="py-3 md:py-5">
              <Link to={`postdetails/${postInfo._id}`} className="text-blue-600 hover:underline text-sm md:text-base">show all comments</Link>
            </div>
            : ''}
        </div>

      </div>
    </div>
  </>
  )
}

