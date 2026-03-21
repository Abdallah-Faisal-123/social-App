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
      const options = {
        url: `https://route-posts.routemisr.com/posts`,
        method: 'GET',
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const{data} = await axios.request(options)
      setPosts(data.data.posts)
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

      {posts ? (
        <div className="py-4 md:py-6">
          <div className="w-full sm:max-w-xl sm:mx-auto px-0 sm:px-2 stagger-children">
            {[...posts].map((post) => <PostCard key={post._id} postInfo={post} />)}
          </div>
        </div>
      ) : (
        <Loading cards={"Posts"} />
      )}
    </>
  )
}
