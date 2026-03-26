import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots, faUserPlus, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../component/Authcontext/Authcontext';
import { getCurrentUser } from '../../utils/getUser';
import { doc, updateDoc, writeBatch, collectionGroup, onSnapshot, where } from 'firebase/firestore';
import { db } from '../Chat/firebase';
import { Link } from 'react-router';
import axios from 'axios';
import { useCallback } from 'react';

export default function Notifications() {
    const { token } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [apiNotifications, setApiNotifications] = useState([]);
    const [chatNotifications, setChatNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const notifications = [...apiNotifications, ...chatNotifications].sort((a, b) => b.time - a.time);

    useEffect(() => {
        const user = getCurrentUser();
            if (user) setCurrentUser(user);
    }, []);

    // 1. Fetch REST API Notifications (Likes, follows, shares)
    const fetchApiNotifs = useCallback(async (isBackgroundSync = false) => {
        if (!token) return;
        if (!isBackgroundSync) setLoading(true);
        try {
            const { data } = await axios.get("https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=50", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const list = data?.data?.notifications || data?.notifications || data?.data || [];
            const parsedNotifs = list.map(n => ({
                id: n._id || n.id || n.notificationId || Math.random().toString(),
                isChat: false,
                text: n.message || n.content || n.body || "New activity on your account",
                time: new Date(n.createdAt || Date.now()),
                read: n.isRead ?? n.read ?? false,
                type: n.type || 'system',
                senderId: n.user?._id || n.sender?._id || n.user?.id || '',
                raw: n
            }));
            setApiNotifications(parsedNotifs);
        } catch (e) {
            console.error("Failed to fetch API notifications:", e);
        } finally {
            if (!isBackgroundSync) setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchApiNotifs();
    }, [fetchApiNotifs]);

    // 2. Real-time Firebase Chat Notifications (Unread messages)
    useEffect(() => {
        if (!currentUser) return;

        const msgsRef = collectionGroup(db, 'messages');
        const q = query(msgsRef, where('read', '==', false)); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newChatNotifs = [];
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const parentId = docSnap.ref.parent.parent?.id; // user1_user2
                
                if (parentId && parentId.includes(String(currentUser.id))) {
                    if (String(data.senderId) !== String(currentUser.id)) {
                        newChatNotifs.push({
                            id: docSnap.id,
                            ref: docSnap.ref,
                            isChat: true,
                            chatId: parentId,
                            senderId: data.senderId,
                            text: data.text || (data.img ? "Photo 📷" : data.audio ? "Audio 🎵" : data.video ? "Video 🎥" : data.file ? "File 📎" : "New Attachment"),
                            time: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(),
                            read: false
                        });
                    }
                }
            });
            setChatNotifications(newChatNotifs);
        }, (error) => {
            console.error("Chat notifications snapshot error:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const markAllAsRead = async () => {
        if (notifications.length === 0) return;
        try {
            // Firebase batch
            const batch = writeBatch(db);
            const firebaseNotifs = notifications.filter(n => n.isChat && n.ref && !n.read);
            firebaseNotifs.forEach(n => batch.update(n.ref, { read: true }));
            if (firebaseNotifs.length > 0) await batch.commit();

            // REST API bulk mark-read
            const unreadApiNotifs = apiNotifications.filter(n => !n.read);
            if (unreadApiNotifs.length > 0) {
                // Optimistic UI clear
                setApiNotifications(prev => prev.map(n => ({...n, read: true})));
                window.dispatchEvent(new Event('updateNotificationCount'));

                await axios.patch(`https://route-posts.routemisr.com/notifications/read-all`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => null);

                // Background sync
                fetchApiNotifs(true);
            }
        } catch (e) {
            console.error("Error clearing notifications", e);
        }
    };

    const handleReadClick = async (notif, e) => {
        if (!notif.isChat && e) {
            e.preventDefault();
        }

        if (notif.read) return;
        
        if (notif.isChat && notif.ref) {
            try { await updateDoc(notif.ref, { read: true }); } catch (er) {}
        } else if (!notif.isChat && notif.id) {
            // Optimistic update
            setApiNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
            window.dispatchEvent(new Event('updateNotificationCount'));
            
            try {
                // The API requires PATCH for marking read
                await axios.patch(`https://route-posts.routemisr.com/notifications/${notif.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Background double-check sync with DB
                fetchApiNotifs(true);
            } catch (error) {
                console.error("Failed to mark API notification as read", error);
            }
        }
    };

    const getIconForType = (type, isChat) => {
        if (isChat) return faCommentDots;
        if (!type) return faBell;
        
        const t = type.toLowerCase();
        if (t.includes('follow') || t === 'follow') return faUserPlus;
        if (t.includes('like') || t === 'like') return faHeart;
        if (t.includes('comment') || t === 'comment') return faComment;
        return faBell;
    };

    const getColorClass = (type, isChat) => {
        if (isChat) return 'from-indigo-500 to-purple-600 shadow-indigo-200';
        
        const t = (type || '').toLowerCase();
        if (t.includes('like')) return 'from-rose-400 to-pink-500 shadow-pink-200';
        if (t.includes('follow')) return 'from-emerald-400 to-teal-500 shadow-teal-200';
        return 'from-blue-400 to-cyan-500 shadow-blue-200';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12 animate-fade-in-up">
                
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <span className="bg-rose-100 text-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faBell} />
                            </span>
                            Notifications
                        </h1>
                        <p className="text-slate-400 text-sm mt-1 ml-1 font-medium">You have {notifications.length} updates</p>
                    </div>
                    {notifications.length > 0 && (
                        <button 
                            onClick={markAllAsRead} 
                            className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer active:scale-95"
                        >
                             Read  All
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100/80 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center animate-pulse">
                            <div className="h-6 bg-slate-200 rounded-lg w-1/3 mx-auto mb-4"></div>
                            <div className="h-4 bg-slate-100 rounded-lg w-1/2 mx-auto"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4">
                                <FontAwesomeIcon icon={faBell} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">You're all caught up!</h3>
                            <p className="text-slate-400 text-sm mt-1">No new notifications right now.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {notifications.map((notif, index) => (
                                <Link 
                                    onClick={(e) => handleReadClick(notif, e)}
                                    to={notif.isChat ? `/chat?user=${notif.senderId}` : '#'} 
                                    key={notif.id} 
                                    className={`block p-5 transition-colors animate-fade-in-up ${notif.read ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-indigo-50/50'}`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="relative mt-1">
                                            <div className={`w-12 h-12 bg-linear-to-br rounded-full flex items-center justify-center text-white text-lg shadow-md ${getColorClass(notif.type, notif.isChat)}`}>
                                                <FontAwesomeIcon icon={getIconForType(notif.type, notif.isChat)} />
                                            </div>
                                            {!notif.read && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                {notif.isChat ? "New Message" : "Activity Notification"}
                                                {!notif.read && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 rounded-full">New</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-0.5 max-w-full truncate">{notif.text}</p>
                                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                                {notif.time.toLocaleDateString([], { month: 'short', day: 'numeric' })} at {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
