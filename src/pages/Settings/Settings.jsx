import React from 'react'
import Navbar from '../../component/Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faCog, faShield, faBell, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Settings() {

  const signOut = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Manage your account preferences</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-3 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          
          {/* Account */}
          <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                <FontAwesomeIcon icon={faCog} />
              </span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Account Settings</p>
                <p className="text-xs text-slate-400 mt-0.5">Update your personal information</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
            </button>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                <FontAwesomeIcon icon={faShield} />
              </span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Privacy & Security</p>
                <p className="text-xs text-slate-400 mt-0.5">Control your privacy settings</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                <FontAwesomeIcon icon={faBell} />
              </span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                <p className="text-xs text-slate-400 mt-0.5">Manage notification preferences</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-sm" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 px-1">Danger Zone</p>
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-rose-50 transition-colors cursor-pointer group"
            >
              <span className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 flex-shrink-0 group-hover:bg-rose-100 transition-colors">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-rose-600 text-sm">Sign out</p>
                <p className="text-xs text-slate-400 mt-0.5">Log out of your account</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-rose-300 text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
  
