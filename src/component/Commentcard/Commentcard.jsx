import img from '../../assets/R.png'

export default function Commentcard({commentInfo}) {
     const commentPhoto = commentInfo.commentCreator.photo.includes('undefined')?img:commentInfo.commentCreator.photo;
    return (
    <div>
      

      <div className="grow ">
       <div className="flex">
          <img src={commentPhoto} alt=""
       className='size-12 rounded-full me-2'
      />
        <div className="bg-gray-100 shadow p-4 w-full rounded-lg">
            <h4 className='font-semibold'>{commentInfo.commentCreator.name}</h4>
            <p className="text-gray-600 w-full">
                {commentInfo.content}
            </p>
        </div>
       </div>
        <div className="flex gap-2  text-gray-500 mt-2 ms-15">
            <span>{new Date(commentInfo.createdAt).toLocaleString()}</span>
            <button className="cursor-pointer">like</button>
            <button className="cursor-pointer">reply</button>
        </div>
      </div>
    </div>
  )
}
