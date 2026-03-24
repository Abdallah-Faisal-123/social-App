import React, { useState, useContext } from 'react'
import Navbar from '../../component/Navbar/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faCog, faShield, faBell, faChevronRight, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../component/Authcontext/Authcontext'

export default function Settings() {
  const { token } = useContext(AuthContext)
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false)
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', rePassword: '' })
  const [loading, setLoading] = useState(false)

  const handlePwdChange = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.rePassword) {
        toast.error("New passwords do not match.");
        return;
    }
    setLoading(true);
    try {
        const options = {
            url: "https://route-posts.routemisr.com/users/change-password",
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            data: {
                password: pwdData.currentPassword,
                newPassword: pwdData.newPassword
            }
        };
        const { data } = await axios.request(options);
        toast.success("Password updated successfully!");
        if (data.token) localStorage.setItem("token", data.token);
        setIsPwdModalOpen(false);
        setPwdData({ currentPassword: '', newPassword: '', rePassword: '' });
    } catch (err) {
        let errMsg = "Incorrect current password or invalid format.";
        if (err.response?.data?.error) errMsg = err.response.data.error;
        if (err.response?.data?.errors?.msg) errMsg = err.response.data.errors.msg;
        if (err.response?.data?.message) errMsg = err.response.data.message;
        toast.error(errMsg);
    } finally {
        setLoading(false);
    }
  }

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

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
            <button onClick={() => setIsPwdModalOpen(true)} className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                <FontAwesomeIcon icon={faShield} />
              </span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-800 text-sm">Change Password</p>
                <p className="text-xs text-slate-400 mt-0.5">Secure your account with a new password</p>
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

      {/* Change Password Modal */}
      {isPwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-800">Change Password</h3>
              <button onClick={() => setIsPwdModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handlePwdChange} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Current Password</label>
                <input required type="password" value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 outline-none transition-all placeholder:text-slate-300" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
                <input required type="password" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 outline-none transition-all placeholder:text-slate-300" placeholder="Enter new password (min. 8 chars)" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Confirm New Password</label>
                <input required type="password" value={pwdData.rePassword} onChange={e => setPwdData({...pwdData, rePassword: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block p-3.5 outline-none transition-all placeholder:text-slate-300" placeholder="Re-enter new password" />
              </div>
              <div className="pt-3">
                <button disabled={loading} type="submit" className="w-full text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold rounded-xl text-sm px-5 py-3.5 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer">
                  {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
  
