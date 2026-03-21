import { Link } from 'react-router';
import img from '../../assets/R.png'

export default function Commentcard({postInfo, commentInfo}) {
     const commentPhoto = commentInfo.commentCreator.photo.includes('undefined') ? img : commentInfo.commentCreator.photo;
     
    return (
    <div className="animate-fade-in-up">
      <div className="flex gap-3">
        <img 
          src={commentPhoto} 
          alt={commentInfo.commentCreator.name}
          className='size-9 md:size-10 rounded-xl object-cover ring-2 ring-slate-100 flex-shrink-0 mt-0.5'
        />
        <div className="flex-1">
          <div className="bg-slate-50 hover:bg-slate-100/80 p-3 md:p-4 rounded-2xl rounded-tl-md transition-colors duration-200">
            <h4 className='font-bold text-sm text-slate-800'>{commentInfo.commentCreator.name}</h4>
            <p className="text-slate-600 text-sm leading-relaxed mt-1">
                {commentInfo.content}
            </p>
          </div>
          <div className="flex gap-4 text-xs text-slate-400 mt-1.5 ml-3 font-medium">
            <Link to={`postdetails/${postInfo._id}`} className="hover:text-indigo-500 transition-colors">
              {new Date(commentInfo.createdAt).toLocaleString()}
            </Link>
            <button className="cursor-pointer hover:text-indigo-500 transition-colors font-semibold">Like</button>
            <button className="cursor-pointer hover:text-indigo-500 transition-colors font-semibold">Reply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
