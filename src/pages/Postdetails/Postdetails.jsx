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
      <div className='min-h-screen bg-slate-50'>
        <section className='py-6 sm:py-8 md:py-12 px-2 sm:px-4'>
          <div className="container mx-auto max-w-full sm:max-w-2xl animate-fade-in-up">
            {post ? <PostCard postInfo={post} commentsLimit={post.commentsCount} /> : <Loading cards={"details"} />}
            <Addcomment id={id} />
          </div>
        </section>
      </div>
    </>
  )
}
