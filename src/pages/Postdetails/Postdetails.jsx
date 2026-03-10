import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../component/Authcontext/Authcontext'
import PostCard from '../../component/PostCard/PostCard'
import Loading from '../../component/Loading/Loading'
import axios from 'axios'
import Navbar from '../../component/Navbar/Navbar'
import Addcomment from '../../component/Addcomment/Addcomment'

export default function Postdetails() {
  const [post, setPost] = useState(null)
  const { id } = useParams()
  const { token } = useContext(AuthContext)
  async function getPostDetails() {
    try {

      const options = {
        url: `https://route-posts.routemisr.com/posts/${id}`,
        method: 'GET',
        headers: {
          Authorization:`Bearer ${token}`
         }
      }

      const { data } = await axios.request(options)
      console.log(data)
      if (data.success === true) {
        setPost(data.data.post)
        
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getPostDetails()
  }, [])
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-100'>
        <section className='py-8 sm:py-12 md:py-16 lg:py-20 h-full px-2 sm:px-4'>
          <div className="container mx-auto max-w-full sm:max-w-2xl">
            {post ? <PostCard postInfo={post} commentsLimit={post.commentsCount} /> : <Loading cards={"details"} />}
          <Addcomment id = {id}/>
            
          </div> 
        </section>
      </div>
    </>
  )
}
