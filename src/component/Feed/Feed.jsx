import axios from "axios";
import PostCard from "../PostCard/PostCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authcontext/Authcontext";
import Loading from "../Loading/Loading";
import UploadPoast from "../UploadPost/UploadPoast";

export default function Feed() {
  const [posts, setPosts] = useState(null)
  const { token } = useContext(AuthContext)

  async function gitAllPosts() {
    try {
      const { data } = await axios.get(
        "https://linked-posts.routemisr.com/posts?limit=50",
        {
          headers: { token }
        }

      )
      const totalPages = data.paginationInfo.numberOfPages
      const options = {
        url: `https://linked-posts.routemisr.com/posts?limit=50&page=${totalPages}`,
        method: 'GET',
        headers: { token }
      }
      const lastPost = await axios.request(options)
      console.log(lastPost)
      lastPost.data.posts.forEach(post => console.log(post.user._id))
      setPosts(lastPost.data.posts)

      /* const options = {
         url: `https://linked-posts.routemisr.com/posts?limit=50&page=83`,
         method: 'GET',
         headers: { token }
       }
 
       const { data } = await axios.request(options)
       console.log(data)
       setPosts(data.posts)
        */
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    gitAllPosts()
  }, [])

  return (
    <>
      <UploadPoast />

      {posts ? <div className="py-3 md:py-5"> <div className="w-full sm:max-w-xl sm:mx-auto bg-gray-200 rounded px-0 sm:px-2">
        {
          [...posts].reverse().map((post) => <PostCard key={post._id} postInfo={post} />)
        }
      </div>  </div> : <Loading cards={"Posts"} />}


    </>
  )
}
