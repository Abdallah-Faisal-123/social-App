import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../component/Authcontext/Authcontext';
import { getCurrentUser } from '../../utils/getUser';
import { collection, query, orderBy, getDocs, doc, updateDoc, writeBatch, collectionGroup } from 'firebase/firestore';
import { db } from '../Chat/firebase';
import { Link } from 'react-router';

export default function Notifications() {
    const { token } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if (user) setCurrentUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        
        const fetchNotifications = async () => {
            try {
                // To fetch all notifications, we find unread messages sent TO this user.
                // We use collectionGroup 'messages' and filter locally for simplicity and speed in this demo environment
                const msgsRef = collectionGroup(db, 'messages');
                const msgsSnap = await getDocs(msgsRef);
                
                const myNotifs = [];
                
                msgsSnap.forEach(docSnap => {
                    const data = docSnap.data();
                    const parentId = docSnap.ref.parent.parent?.id; // user1_user2
                    
                    if (parentId && parentId.includes(String(currentUser.id))) {
                        // Ensure the message was NOT sent by us, and is Unread!
                        if (String(data.senderId) !== String(currentUser.id) && data.read === false) {
                            myNotifs.push({
                                id: docSnap.id,
                                ref: docSnap.ref,
                                chatId: parentId,
                                text: data.text || (data.img ? "Photo 📷" : data.audio ? "Audio 🎵" : data.video ? "Video 🎥" : data.file ? "File 📎" : "New Attachment"),
                                senderId: data.senderId,
                                time: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date()
                            });
                        }
                    }
                });

                // Sort by newest
                myNotifs.sort((a, b) => b.time - a.time);
                
                setNotifications(myNotifs);
            } catch (err) {
                console.error("Failed to load notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [currentUser]);

    const markAllAsRead = async () => {
        if (notifications.length === 0) return;
        try {
            const batch = writeBatch(db);
            notifications.forEach(n => {
                batch.update(n.ref, { read: true });
            });
            await batch.commit();
            setNotifications([]);
        } catch (e) {
            console.error("Error clearing notifications", e);
        }
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
                        <p className="text-slate-400 text-sm mt-1 ml-1 font-medium">You have {notifications.length} unread updates</p>
                    </div>
                    {notifications.length > 0 && (
                        <button 
                            onClick={markAllAsRead} 
                            className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer active:scale-95"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} /> Clear All
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
                                    to={`/chat`} 
                                    key={notif.id} 
                                    className="block p-5 hover:bg-slate-50 transition-colors animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="relative mt-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg shadow-md shadow-indigo-200">
                                                <FontAwesomeIcon icon={faCommentDots} />
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                New Message
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 rounded-full">Unread</span>
                                            </p>
                                            <p className="text-sm text-slate-500 mt-0.5 max-w-full truncate">{notif.text}</p>
                                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                                {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
