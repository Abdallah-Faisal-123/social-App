import React from 'react'
import Navbar from '../../component/Navbar/Navbar'

export default function Settings() {

  const signOut = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <button
            onClick={signOut}
            type="button"
            className="rounded-lg text-white cursor-pointer bg-red-500/50 hover:bg-red-500 p-4"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
