import React, { useEffect, useState, useContext,useRef } from 'react';
import { getCurrentUser } from "../../utils/getUser";
import { useChatMessages } from "../../utils/useChatMessages";
import { sendMessage } from "../../utils/sendMessage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import {
    faSearch,
    faPaperPlane,
    faEllipsisV,
    faImage,
    faSmile,
    faPhone,
    faVideo,
    faChevronLeft,
    faMicrophone,
    faPlus,
    faArrowAltCircleLeft,
    faCheck,
    faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../component/Authcontext/Authcontext';
import { collection, query, orderBy, limit, getDocs, doc, setDoc, updateDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';

import { saveContact } from '../../utils/useSaveContact';
import { db } from './firebase';

export default function Chat() {
    const [lastUsers, setLastUsers] = useState([]);
    const { token } = useContext(AuthContext);
        const [currentUser, setCurrentUser] = useState(null);
        const [newContact,setNewContact] = useState(false)
        const [loading, setLoading] = useState(false);
        const scrollRef = useRef(null);
        const [uploading, setUploading] = useState(false);     
        // تعديل تعريف الـ State في بداية الكومبوننت
const [moreFrnds, setMoreFrnds] = useState(() => {
    const savedPage = localStorage.getItem("lastPaginationPage");
    return savedPage ? parseInt(savedPage) : 25; // لو مفيش، ابدأ بـ 25
});   
        // Removed the fixed timeout loading so new users don't wait unnecessarily
    async function getlatestusers() {
    if (!token || !currentUser) return;
    
    try {

        const requests = [];
        for (let i = 1; i <= moreFrnds; i++) {
            requests.push(
                axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=50&page=${i}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );
        }

        const responses = await Promise.all(requests);
        let allPossibleContacts = [];
        
        responses.forEach(res => {
            if (res.data.data.suggestions) {
                allPossibleContacts = [...allPossibleContacts, ...res.data.data.suggestions];
            }
        });

        const uniqueMap = new Map();
        allPossibleContacts.forEach(u => {
            if (u && u._id !== currentUser.id) uniqueMap.set(u._id, u);
        });

        const usersArray = Array.from(uniqueMap.values());

        const updatedUsers = await Promise.all(usersArray.map(async (user) => {
            const chatId = [currentUser.id, user._id].sort().join("_");
            const msgsRef = collection(db, "chats", chatId, "messages");
            const q = query(msgsRef, orderBy("createdAt", "desc"), limit(1));

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const statusRef = doc(db, "userStatus", user._id);
                const statusSnap = await getDoc(statusRef);
                const online = statusSnap.exists() ? statusSnap.data().online : false;
                const lastDoc = querySnapshot.docs[0].data();
                return {
                    ...user,
                    online,
                    lastMsg: lastDoc.text || (lastDoc.img ? "Photo 📷" : ""),
                   rawTime: lastDoc.createdAt?.seconds || 0,
                    time: lastDoc.createdAt?.seconds
                        ? new Date(lastDoc.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ""
                };
            }
            return null; 
        }));

        const finalResults = updatedUsers.filter(u=>u !== null).sort((a,b)=> b.rawTime - a.rawTime)
         
        localStorage.setItem("savedUsers",JSON.stringify(finalResults))
        setLastUsers(finalResults);
        setLoading(true)  
    } catch (error) {
        console.error("Error fetching latest users:", error);
    }
}
function getSavedUsers(){
        const saved = localStorage.getItem("savedUsers")
        if (saved) {
            setLastUsers(JSON.parse(saved));
        } else {
            setLastUsers([]);
        }
        // Turn off loading immediately once local state initializes (especially for new users)
        setLoading(true);
}
useEffect(() => {
    if (currentUser && token) {
        getSavedUsers()
        getlatestusers();
    }
}, [token, currentUser]);
       
     async function getAllUsers() {
    if (!token || !currentUser) return;
    setLoading(false)

    setLastUsers([]); 

    try {
        let allUsersAccumulator = [];
        const totalPagesToFetch = moreFrnds;
  
        const requests = [];
        for (let i = 1; i <= totalPagesToFetch; i++) {
        
            requests.push(
                axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=50&page=${i}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );
            
        
        }

        
        const responses = await Promise.all(requests);
        
        
        responses.forEach(response => {
            const pageUsers = response.data.data.suggestions;
            if (pageUsers) {
                allUsersAccumulator = [...allUsersAccumulator, ...pageUsers];
            }
        });

        
        const uniqueUsersMap = new Map();
        allUsersAccumulator.forEach(user => {
            if (user && user._id !== currentUser.id && !uniqueUsersMap.has(user._id)) {
                uniqueUsersMap.set(user._id, {
                    ...user,
                    lastMsg: 'Tap to start chatting', 
                    time: ''
                });
            }
        });

        const finalResults = Array.from(uniqueUsersMap.values());
        setLastUsers(finalResults);
        setLoading(true)

    } catch (error) {
        console.error("Error fetching massive users list:", error);
        
    } finally{
        setLoading(false)
    }
}
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get(
                    "https://route-posts.routemisr.com/users/profile-data",
                    {  headers:{
                        Authorization: `Bearer ${token}`
                        } }
                );
                if (data.data.user) {
                    setCurrentUser({
                        id: data.data.user._id,
                        name: data.data.user.name,
                        photo: data.data.user.photo
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // Fallback to token decode if API fails
                setCurrentUser(getCurrentUser());
            }
        };

        fetchUserProfile();
    }, [token]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
    const [text, setText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const chatId = selectedUser && currentUser
        ? [currentUser.id, selectedUser._id].sort().join("_")
        : null;

    const messages = useChatMessages(chatId);

    const [selectedUserOnline, setSelectedUserOnline] = useState(false);

    // Track currentUser online status globally
    useEffect(() => {
        if (!currentUser?.id) return;
        const userStatusRef = doc(db, "userStatus", currentUser.id);
        const setOnlineStatus = async (isOnline) => {
            try { await setDoc(userStatusRef, { online: isOnline, lastSeen: serverTimestamp() }, { merge: true }); } catch (e) {}
        };
        setOnlineStatus(true);
        
        const handleBeforeUnload = () => { setOnlineStatus(false); };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            setOnlineStatus(false);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser]);

    // Track real-time online status for the currently selected chat user
    useEffect(() => {
        if (!selectedUser?._id) return;
        const unsub = onSnapshot(doc(db, "userStatus", selectedUser._id), (docSnap) => {
            if (docSnap.exists()) {
                setSelectedUserOnline(docSnap.data().online);
            } else {
                setSelectedUserOnline(false);
            }
        });
        return () => unsub();
    }, [selectedUser]);

    // Mark unread messages from the active sender as read
    useEffect(() => {
        if (!chatId || !currentUser || messages.length === 0) return;
        const unreadMsgs = messages.filter(
            (msg) => msg.senderId !== currentUser.id && msg.read === false
        );
        if (unreadMsgs.length > 0) {
            unreadMsgs.forEach(async (msg) => {
                const msgRef = doc(db, "chats", chatId, "messages", msg.id);
                try { await updateDoc(msgRef, { read: true }); } catch (e) {}
            });
        }
    }, [messages, chatId, currentUser]);

    const filteredUsers = lastUsers.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
}, [messages]);

const handleSend = async () => {
    // ... كود التحقق (Validation)
    try {
        await sendMessage(selectedUser._id, text, currentUser.id);
        
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setLastUsers(prevUsers => {
            const updated = prevUsers.map(user => 
                user._id === selectedUser._id 
                ? { ...user, lastMsg: text, time: now, rawTime: Date.now() / 1000 } 
                : user
            );
            // احفظ التحديث الجديد في الـ Local Storage فوراً
            localStorage.setItem("savedUsers", JSON.stringify(updated));
            return updated;
        });

        await saveContact(currentUser.id, selectedUser, chatId);
        setText("");
    } catch (error) {
        console.error(error);
    }
};



const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images"); // حط الـ Preset بتاعك هنا

    setUploading(true);
    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dvzdfcwfa/image/upload", // حط الـ Cloud Name هنا
            formData
        );
        const downloadURL = res.data.secure_url;

        // ابعت الرابط لـ Firebase (الرسائل) زي ما إحنا
        await sendMessage(selectedUser._id, "", currentUser.id, downloadURL);
        
        setLastUsers(prev => prev.map(u => 
            u._id === selectedUser._id ? { ...u, lastMsg: "Photo 📷" } : u
        ));
    } catch (err) {
        console.error("Cloudinary Error:", err);
    } finally {
        setUploading(false);
    }
};   return (
        <div className="flex h-screen bg-white overflow-hidden font-['Inter',sans-serif]">
            {/* Sidebar - Modern List */}
            <aside
                className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-40 w-full sm:w-96 bg-gray-50/50 backdrop-blur-xl border-r border-gray-200/60 transition-all duration-500 lg:relative lg:translate-x-0 group`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Messages</h1>
                            {newContact ? (
                               <>
                                <button onClick={() => {
                                    setLastUsers([]);
                                    getlatestusers();
                                    getSavedUsers()
                                    setNewContact(false);
                                }} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                                </button>
                                   
                                <button onClick={() => {
                                    const nextBatch = moreFrnds + 1;
                                    setMoreFrnds(nextBatch);
                                    localStorage.setItem("lastPaginationPage", nextBatch.toString());
                                    getAllUsers();
                                }} className="w-11 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                  more   
                                </button>                                
                                </>
                            ) : (
                                <>
                                <button onClick={() => {
                                    getAllUsers();
                                    setNewContact(true);
                                    setLoading(false)
                                }} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>

                                </>
                            )} 
                            
                        </div>

                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-blue-600 text-gray-400">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl text-sm shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto px-3 space-y-1">
                            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        if (window.innerWidth < 1024) setMobileSidebarOpen(false);
                                    }}
                                    className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedUser?._id === user._id
                                        ? 'bg-blue-600 shadow-xl shadow-blue-100'
                                        : 'hover:bg-white hover:shadow-md'
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`p-0.5 rounded-full ${selectedUser?._id === user._id ? 'bg-white/20' : 'bg-transparent'}`}>
                                            <img src={user?.photo || user?.avatar} alt={user?.name} className="w-14 h-14 rounded-full bg-white object-cover shadow-inner" />
                                        </div>
                                        {user?.online && (
                                            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-base font-bold truncate ${selectedUser?._id === user._id ? 'text-white' : 'text-gray-900'}`}>
                                                {user?.name}
                                            </h3>
                                            <span className={`text-[11px] font-medium ${selectedUser?._id === user._id ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {user?.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${selectedUser?._id === user._id ? 'text-blue-50/80' : 'text-gray-500'}`}>
                                            {user?.lastMsg}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <p className="text-gray-500 font-medium">No messages found</p>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col space-y-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex items-center p-4 rounded-2xl animate-pulse">
                                                <div className="relative shrink-0">
                                                    <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                                                </div>
                                                <div className="ml-4 flex-1 overflow-hidden">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Chat Interface */}
            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                {!selectedUser ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 p-8 text-center animate-fade-in-up">
                        <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600 text-4xl mb-6 shadow-inner">
                            <FontAwesomeIcon icon={faPaperPlane} className="-rotate-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Messages</h2>
                        <p className="text-gray-500 max-w-sm">
                            Connect with your friends by selecting a conversation from the sidebar.
                            Start sharing moments and staying in touch!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Modern Header */}
                        <header className="h-20 sm:h-24 flex items-center justify-between px-6 border-b border-gray-100/80 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
                            <div className="flex items-center min-w-0">
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="lg:hidden mr-4 p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>

                                <div className="relative shrink-0 cursor-pointer group">
                                    <img
                                        src={selectedUser?.photo || selectedUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-blue-100 transition-all"
                                        alt={selectedUser?.name}
                                    />
                                    {selectedUserOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="ml-4 truncate">
                                    <h2 className="text-lg font-extrabold text-gray-900 truncate tracking-tight">{selectedUser?.name}</h2>
                                    <div className="flex items-center space-x-1.5">
                                        <span className={`w-2 h-2 rounded-full ${selectedUserOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <p className="text-xs font-semibold text-gray-400">{selectedUserOnline ? 'Online now' : 'Offline'}</p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Dynamic Messages Area */}
                        <div 
                          ref={scrollRef}
                        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed overflow-x-hidden scrollbar-hide">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-sm font-medium">No messages yet.</p>
                                    <p className="text-xs">Send a message to start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-end space-x-3 group animate-fade-in-up ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.senderId !== currentUser?.id && (
                                            <img src={selectedUser?.photo || selectedUser?.avatar} className="w-8 h-8 rounded-lg shadow-sm" alt="Avatar" />
                                        )}

                                        <div className={`max-w-[80%] sm:max-w-md ${message.senderId === currentUser?.id
                                            ? 'bg-blue-600 text-white rounded-2xl rounded-br-none shadow-lg shadow-blue-100 hover:shadow-xl'
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-none shadow-sm hover:shadow-md'
                                            } px-5 py-3 transition-shadow overflow-hidden`}
                                        >
                                            {message.img && (
                                                <img src={message.img} className="rounded-xl w-full h-auto mb-2" alt="Attachment" />
                                            )}
                                            {message.text && (
                                                <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                                            )}
                                            <span className={`flex items-center text-[10px] mt-2 font-semibold ${message.senderId === currentUser?.id ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
                                                {message.time || (message.createdAt?.seconds ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                                                {message.senderId === currentUser?.id && (
                                                    <span className="ml-1.5 flex items-center">
                                                        {message.read ? (
                                                            <FontAwesomeIcon icon={faCheckDouble} className="text-blue-200" />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faCheck} className="text-blue-200/60" />
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Premium Input Bar */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="max-w-4xl mx-auto flex items-center space-x-3">
                                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-3xl pl-4 pr-11 py-2 relative transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:bg-white shadow-inner">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 text-sm font-medium py-3 px-4 placeholder-gray-400 outline-none"
                                    />
                                    <div className=" absolute bg-gray-50  size-6 right-10">
                                        
                                        {uploading ?<span className="text-xs text-blue-500 animate-pulse mr-2 -mt-2">Uploading...</span>
                                        :
                                        <>
                                        <label className="ml-2 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors">
                                            <FontAwesomeIcon icon={faImage} className="text-2xl" />
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>

                                        </>
                                        }
                                    </div>
                                </div>

                                <button onClick={handleSend}
                                    className="w-14 h-14 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 group">
                                    <FontAwesomeIcon icon={faPaperPlane} className="group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <style>{`
                @keyframes fade-in-up {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                  animation: fade-in-up 0.4s ease-out forwards;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
