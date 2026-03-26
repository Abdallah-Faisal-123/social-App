
import { faBell, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquareShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router";
import { useState, useEffect, useRef, useContext } from "react";
import { getCurrentUser } from "../../utils/getUser";
import { collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../pages/Chat/firebase";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../component/Authcontext/Authcontext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [apiUnreadCount, setApiUnreadCount] = useState(0);
  const isInitialLoad = useRef(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const unreadCount = chatUnreadCount + apiUnreadCount;

  // 1. Fetch API Unread Count
  useEffect(() => {
     if (!token) return;
     const fetchUnread = async () => {
         try {
             const { data } = await axios.get('https://route-posts.routemisr.com/notifications/unread-count', {
                 headers: { Authorization: `Bearer ${token}` }
             });
             const num = data?.numOfUnReadNotifications ?? data?.unreadCount ?? data?.count ?? data?.data?.count ?? data?.data?.unReadCount ?? 0;
             setApiUnreadCount(Number(num));
         } catch (e) {
             console.error("Failed fetching unread count from API:", e);
         }
     };
     fetchUnread();

     const handleUpdate = () => { fetchUnread(); };
     window.addEventListener('updateNotificationCount', handleUpdate);
     return () => window.removeEventListener('updateNotificationCount', handleUpdate);
  }, [token]);

  // 2. Firebase Chat Real-time Unread Count
  useEffect(() => {
    let unsubscribe = null;
    const initNotifications = async () => {
        const user = await getCurrentUser();
        if (!user) return;

        const q = query(collectionGroup(db, 'messages'), where('read', '==', false));
        unsubscribe = onSnapshot(q, (snapshot) => {
            let count = 0;
            snapshot.forEach(doc => {
                const parentId = doc.ref.parent.parent?.id;
                if (parentId && parentId.includes(String(user.id))) {
                    const data = doc.data();
                    if (String(data.senderId) !== String(user.id)) {
                        count++;
                    }
                }
            });
            setChatUnreadCount(count);

            // Handle interactive popup notifications with synthesized audio chime
            if (!isInitialLoad.current) {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const data = change.doc.data();
                        const parentId = change.doc.ref.parent.parent?.id;
                        if (parentId && parentId.includes(String(user.id))) {
                            if (String(data.senderId) !== String(user.id)) {
                                const textPreview = data.text || (data.img ? "Photo 📷" : data.audio ? "Audio 🎵" : data.video ? "Video 🎥" : data.file ? "File 📎" : "Attachment");
                                toast.info(`New Message: ${textPreview.length > 30 ? textPreview.substring(0, 30) + '...' : textPreview}`, {
                                    icon: "💬",
                                    onClick: () => navigate('/chat'),
                                    autoClose: 4000
                                });

                                // Play a highly optimized native Web Audio bell tone
                                try {
                                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                                    const oscillator = audioCtx.createOscillator();
                                    const gainNode = audioCtx.createGain();
                                    oscillator.type = 'sine';
                                    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                                    oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.15);
                                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                                    oscillator.connect(gainNode);
                                    gainNode.connect(audioCtx.destination);
                                    oscillator.start();
                                    oscillator.stop(audioCtx.currentTime + 0.2);
                                } catch(e) { console.error("Audio block fallback:", e); }
                            }
                        }
                    }
                });
            } else {
                if (count > 0) {
                    toast.info(`You have ${count} unread chat message${count > 1 ? 's' : ''} waiting!`, {
                        icon: "🔔",
                        onClick: () => navigate('/notifications'),
                        autoClose: 5000
                    });
                }
                isInitialLoad.current = false;
            }
        });
    };
    initNotifications();

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-white/10 shadow-sm">
        <div className="container mx-auto py-3 px-4 sm:px-6 flex items-center justify-between">

          <h1 className="flex-shrink-0">
            <Link to="/" className="text-xl md:text-2xl font-extrabold flex items-center gap-2 group">
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></span>
                <FontAwesomeIcon icon={faSquareShareNodes} className="relative text-white text-xl md:text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl" />
              </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">SocialHup</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 ms-auto px-3">
            <li>
              <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat" className={({ isActive }) => `relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Chat
                {chatUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow ring-2 ring-white">
                    {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({ isActive }) => `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                Settings
              </NavLink>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <Link to="/notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
              <FontAwesomeIcon icon={faBell} className="text-lg" />
              {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                      {unreadCount}
                  </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="text-lg" />
              {chatUnreadCount > 0 && !isMobileMenuOpen && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="flex flex-col p-3 pt-0 space-y-1">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-50'} font-semibold transition-all duration-200 block px-4 py-3 rounded-xl`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `relative flex items-center justify-between ${isActive ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-50'} font-semibold transition-all duration-200 block px-4 py-3 rounded-xl`}
              >
                <span>Chat</span>
                {chatUnreadCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                    {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-50'} font-semibold transition-all duration-200 block px-4 py-3 rounded-xl`}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-50'} font-semibold transition-all duration-200 block px-4 py-3 rounded-xl`}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
