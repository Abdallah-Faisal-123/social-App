import React from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCompass } from '@fortawesome/free-solid-svg-icons'

export default function Notfound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up max-w-md">
        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] md:text-[160px] font-black bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-none select-none animate-gradient">
            404
          </h1>
          <div className="absolute inset-0 text-[120px] md:text-[160px] font-black text-indigo-200/20 leading-none blur-2xl select-none">
            404
          </div>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 animate-float">
          <FontAwesomeIcon icon={faCompass} className="text-2xl text-indigo-400" />
        </div>

        {/* Text */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
          Page not found
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved to a different location.
        </p>

        {/* CTA Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-95"
        >
          <FontAwesomeIcon icon={faHome} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
