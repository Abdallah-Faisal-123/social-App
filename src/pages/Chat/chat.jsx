import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
    faMicrophoneSlash,
    faPlus,
    faArrowAltCircleLeft,
    faCheck,
    faCheckDouble,
    faPlay,
    faPause,
    faStop,
    faTrash,
    faReply,
    faTimes,
    faPaperclip,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../component/Authcontext/Authcontext';
import { collection, query, orderBy, limit, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';

import { saveContact } from '../../utils/useSaveContact';
import { db } from './firebase';

// ── Custom Voice Message Player Component ──
function VoiceMessagePlayer({ src, isMine }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onLoaded = () => setDuration(audio.duration || 0);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
        const onEnded = () => { setPlaying(false); setCurrentTime(0); };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);
        };
    }, [src]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) { audio.pause(); } else { audio.play(); }
        setPlaying(!playing);
    };

    const formatTime = (t) => {
        if (!t || isNaN(t)) return '0:00';
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Generate fixed waveform bars (seeded from src length for variety)
    const barCount = 28;
    const bars = useRef(
        Array.from({ length: barCount }, (_, i) => {
            const seed = ((i + 1) * 7 + (src?.length || 0)) % 100;
            return 20 + (seed % 80); // height 20-100%
        })
    ).current;

    return (
        <div className="flex items-center gap-2.5 py-1" style={{ minWidth: 220 }}>
            <audio ref={audioRef} src={src} preload="metadata" />
            <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full border-none flex items-center justify-center text-sm cursor-pointer shrink-0 transition-all duration-150 ease-out active:scale-90 ${
                    isMine ? 'bg-white/25 text-white backdrop-blur-sm hover:bg-white/35 hover:shadow-[0_2px_12px_rgba(255,255,255,0.15)]' : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-[0_2px_12px_rgba(59,130,246,0.3)]'
                }`}
                aria-label={playing ? 'Pause' : 'Play'}
            >
                <FontAwesomeIcon icon={playing ? faPause : faPlay} style={playing ? {} : { marginLeft: 2 }} />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-0.5 h-8">
                    {bars.map((h, i) => {
                        const barPos = (i / barCount) * 100;
                        const active = barPos < progress;
                        return (
                            <span
                                key={i}
                                className={`w-[3px] rounded-full transition-all duration-150 ease-out shrink-0 ${active ? (isMine ? 'bg-white/90' : 'bg-blue-500') : (isMine ? 'bg-white/30' : 'bg-gray-300')} ${playing && active ? 'animate-[bar-bounce_0.5s_ease-in-out_infinite]' : ''}`}
                                style={{ height: `${h}%` }}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-start mt-0.5">
                    <span className={`text-[11px] font-semibold tabular-nums ${isMine ? 'text-white/65' : 'text-gray-400'}`}>
                        {playing || currentTime > 0 ? formatTime(currentTime) : formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Chat() {
    const [lastUsers, setLastUsers] = useState([]);
    const { token } = useContext(AuthContext);
        const [currentUser, setCurrentUser] = useState(null);
        const [newContact,setNewContact] = useState(false)
        const [loading, setLoading] = useState(false);
        const scrollRef = useRef(null);
        const [uploading, setUploading] = useState(false);     
        const [isRecording, setIsRecording] = useState(false);
        const [recordingTime, setRecordingTime] = useState(0);
        const recordingTimerRef = useRef(null);
        const mediaRecorderRef = useRef(null);
        const audioChunksRef = useRef([]);
        // Reply state
        const [replyingTo, setReplyingTo] = useState(null);
        // Delete menu state
        const [deleteMenuMsg, setDeleteMenuMsg] = useState(null);
        const [deleteMenuPos, setDeleteMenuPos] = useState({ x: 0, y: 0 });
        const deleteMenuRef = useRef(null);
        const longPressTimerRef = useRef(null);
        const mainSwipeStartX = useRef(null);
        const [hiddenMsgIds, setHiddenMsgIds] = useState(() => {
            try { return JSON.parse(localStorage.getItem('hiddenMsgIds') || '[]'); } catch { return []; }
        });
        // Contact delete state
        const [contactToDelete, setContactToDelete] = useState(null);
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

    const { messages, loadingMessages } = useChatMessages(chatId);

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
        await sendMessage(selectedUser._id, text, currentUser.id, null, null, replyingTo);
        setReplyingTo(null);
        
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



const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images");

    setUploading(true);
    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dvzdfcwfa/auto/upload",
            formData
        );
        const downloadURL = res.data.secure_url;

        let imgUrl = null, audioUrl = null, videoUrl = null, fileUrl = null;
        let msgTypeStr = "File 📎";

        if (file.type.startsWith('image/')) {
            imgUrl = downloadURL;
            msgTypeStr = "Photo 📷";
        } else if (file.type.startsWith('audio/')) {
            audioUrl = downloadURL;
            msgTypeStr = "Audio 🎵";
        } else if (file.type.startsWith('video/')) {
            videoUrl = downloadURL;
            msgTypeStr = "Video 🎥";
        } else {
            fileUrl = downloadURL;
        }

        await sendMessage(selectedUser._id, "", currentUser.id, imgUrl, audioUrl, replyingTo, videoUrl, fileUrl);
        setReplyingTo(null);
        
        setLastUsers(prev => prev.map(u => 
            u._id === selectedUser._id ? { ...u, lastMsg: msgTypeStr } : u
        ));
    } catch (err) {
        console.error("Cloudinary Error:", err);
    } finally {
        setUploading(false);
    }
};

const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });
            uploadAudioFile(audioFile);
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        recordingTimerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        console.error("Microphone access error:", err);
        alert("Could not access microphone. Please check permissions!");
    }
};

const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
    }
};

const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
        setRecordingTime(0);
    }
};

const formatRecTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
};

const uploadAudioFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images"); 

    setUploading(true);
    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dvzdfcwfa/video/upload", 
            formData
        );
        const downloadURL = res.data.secure_url;

        await sendMessage(selectedUser._id, "", currentUser.id, null, downloadURL, replyingTo);
        setReplyingTo(null);
        
        setLastUsers(prev => prev.map(u => 
            u._id === selectedUser._id ? { ...u, lastMsg: "Voice message 🎤" } : u
        ));
    } catch (err) {
        console.error("Cloudinary Audio Error:", err);
    } finally {
        setUploading(false);
    }
};

// ── Close delete menu on outside click ──
useEffect(() => {
    const handleClickOutside = (e) => {
        if (deleteMenuRef.current && !deleteMenuRef.current.contains(e.target)) {
            setDeleteMenuMsg(null);
        }
    };
    if (deleteMenuMsg) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
    };
}, [deleteMenuMsg]);

// ── Open delete context menu ──
const openDeleteMenu = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isMine = message.senderId === currentUser?.id;
    setDeleteMenuPos({
        x: isMine ? rect.left : rect.right - 200,
        y: rect.top - 10
    });
    setDeleteMenuMsg(message);
};

// Long press handlers for mobile
const handleTouchStart = (e, message) => {
    longPressTimerRef.current = setTimeout(() => {
        const touch = e.touches[0];
        const fakeEvent = { preventDefault: () => {}, stopPropagation: () => {}, currentTarget: e.currentTarget, clientX: touch.clientX, clientY: touch.clientY };
        // Use touch position directly
        setDeleteMenuPos({ x: touch.clientX - 100, y: touch.clientY - 80 });
        setDeleteMenuMsg(message);
    }, 500);
};

const handleTouchEnd = () => {
    clearTimeout(longPressTimerRef.current);
};

// ── Main Chat Swipe Handlers ──
const handleMainTouchStart = (e) => {
    // Only register one touch to avoid pinch gestures
    if (e.touches.length === 1) {
        mainSwipeStartX.current = e.touches[0].clientX;
    }
};

const handleMainTouchEnd = (e) => {
    if (mainSwipeStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - mainSwipeStartX.current;
    
    // Swipe Right -> Open Sidebar (like swiping back)
    // You only want this active on mobile views (< 1024)
    if (diffX > 75 && window.innerWidth < 1024) {
        setMobileSidebarOpen(true);
    }
    
    mainSwipeStartX.current = null;
};

// ── Delete for everyone (removes from Firebase) ──
const deleteForEveryone = async (message) => {
    if (!chatId || !message?.id) return;
    try {
        const msgRef = doc(db, 'chats', chatId, 'messages', message.id);
        await deleteDoc(msgRef);
        setDeleteMenuMsg(null);
    } catch (err) {
        console.error('Delete for everyone failed:', err);
    }
};

// ── Delete for me (hides locally) ──
const deleteForMe = (message) => {
    if (!message?.id) return;
    const updated = [...hiddenMsgIds, message.id];
    setHiddenMsgIds(updated);
    localStorage.setItem('hiddenMsgIds', JSON.stringify(updated));
    setDeleteMenuMsg(null);
};

// Filter hidden messages
const visibleMessages = messages.filter(m => !hiddenMsgIds.includes(m.id));

// ── Handle reply ──
const handleReply = (message) => {
    setReplyingTo({
        id: message.id,
        text: message.text || (message.img ? 'Photo 📷' : (message.audio ? 'Voice message 🎤' : 'Message')),
        senderId: message.senderId,
        senderName: message.senderId === currentUser?.id ? 'You' : selectedUser?.name
    });
    setDeleteMenuMsg(null);
    // Auto focus the input after a short delay
    setTimeout(() => {
        const input = document.getElementById('chat-text-input');
        if (input) input.focus();
    }, 50);
};

// ── Delete contact ──
const handleDeleteContact = async (user) => {
    if (!user?._id || !currentUser?.id) return;
    try {
        const cId = [currentUser.id, user._id].sort().join("_");

        // Delete all messages in the chat
        const msgsRef = collection(db, "chats", cId, "messages");
        const msgsSnap = await getDocs(msgsRef);
        const batch = writeBatch(db);
        msgsSnap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();

        // Remove from local state
        const updated = lastUsers.filter(u => u._id !== user._id);
        setLastUsers(updated);
        localStorage.setItem('savedUsers', JSON.stringify(updated));

        // If this was the selected user, deselect
        if (selectedUser?._id === user._id) {
            setSelectedUser(null);
            if (window.innerWidth < 1024) setMobileSidebarOpen(true);
        }
    } catch (err) {
        console.error('Delete contact failed:', err);
    } finally {
        setContactToDelete(null);
    }
};

   return (
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
                                    className={`group/contact flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedUser?._id === user._id
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

                                    {/* Delete contact button */}
                                    <button
                                        className={`w-8 h-8 rounded-full border-none bg-transparent flex items-center justify-center text-[13px] cursor-pointer transition-all duration-150 shrink-0 ml-2 ${
                                            selectedUser?._id === user._id
                                                ? 'opacity-100 text-white/50 hover:bg-white/15 hover:text-white'
                                                : 'opacity-0 text-gray-300 group-hover/contact:opacity-100 hover:bg-red-500/10 hover:text-red-500 hover:scale-110'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setContactToDelete(user);
                                        }}
                                        title="Delete contact"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
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

            {/* ── Delete Contact Confirmation Modal ── */}
            {contactToDelete && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-[fade-in-up_0.25s_ease-out]" onClick={() => setContactToDelete(null)}>
                    <div className="bg-white rounded-[20px] pt-7 px-6 pb-5 w-[340px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)] text-center animate-[delete-menu-in_0.25s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <img src={contactToDelete?.photo || contactToDelete?.avatar} alt={contactToDelete?.name} className="w-14 h-14 rounded-full object-cover border-[3px] border-red-200 shadow-[0_4px_12px_rgba(239,68,68,0.15)]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-gray-900 mb-2">Delete Chat</h3>
                        <p className="text-[13.5px] text-gray-500 leading-relaxed mb-5">
                            Delete conversation with <strong>{contactToDelete?.name}</strong>? All messages will be permanently removed.
                        </p>
                        <div className="flex gap-2.5">
                            <button className="flex-1 py-[11px] rounded-xl border-none text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97] bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setContactToDelete(null)}>
                                Cancel
                            </button>
                            <button className="flex-1 py-[11px] rounded-xl border-none text-sm font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97] bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:bg-red-600" onClick={() => handleDeleteContact(contactToDelete)}>
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Chat Interface */}
            <main 
                className="flex-1 flex flex-col min-w-0 bg-white relative"
                onTouchStart={handleMainTouchStart}
                onTouchEnd={handleMainTouchEnd}
            >
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
                        <header className="h-16 sm:h-24 flex items-center justify-between px-4 sm:px-6 border-b border-gray-100/80 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
                            <div className="flex items-center min-w-0">
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="lg:hidden mr-2 p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
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
                        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed overflow-x-hidden scrollbar-hide">
                            {loadingMessages ? (
                                <div className="flex flex-col space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`flex items-end space-x-3 group animate-pulse ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`w-2/3 sm:max-w-md ${i % 2 === 0 ? 'bg-blue-100' : 'bg-white'} rounded-2xl ${i % 2 === 0 ? 'rounded-br-none' : 'rounded-bl-none'} shadow-sm h-16`}></div>
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-sm font-medium">No messages yet.</p>
                                    <p className="text-xs">Send a message to start the conversation!</p>
                                </div>
                            ) : (
                                visibleMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-end space-x-3 group animate-fade-in-up msg-row ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.senderId !== currentUser?.id && (
                                            <img src={selectedUser?.photo || selectedUser?.avatar} className="w-8 h-8 rounded-lg shadow-sm" alt="Avatar" />
                                        )}

                                        <div
                                            className={`relative max-w-[80%] sm:max-w-md ${message.senderId === currentUser?.id
                                                ? 'bg-blue-600 text-white rounded-2xl rounded-br-none shadow-lg shadow-blue-100 hover:shadow-xl'
                                                : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-none shadow-sm hover:shadow-md'
                                                } px-5 py-3 transition-shadow overflow-hidden cursor-pointer flex flex-col`}
                                            onContextMenu={(e) => openDeleteMenu(e, message)}
                                            onTouchStart={(e) => handleTouchStart(e, message)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchMove={handleTouchEnd}
                                        >
                                            {/* ── Reply Snippet Inside Bubble ── */}
                                            {message.replyTo && (
                                                <div className={`mb-2 pl-3 py-1.5 pr-3 rounded-lg border-l-4 text-xs ${message.senderId === currentUser?.id ? 'bg-blue-700/30 border-blue-200 text-blue-50' : 'bg-gray-100 border-blue-400 text-gray-500'}`}>
                                                    <div className={`font-bold mb-0.5 ${message.senderId === currentUser?.id ? 'text-blue-100' : 'text-blue-600'}`}>
                                                        {message.replyTo.senderName}
                                                    </div>
                                                    <div className="truncate opacity-90">{message.replyTo.text}</div>
                                                </div>
                                            )}

                                            {message.img && (
                                                <img src={message.img} className="rounded-xl w-full h-auto mb-2" alt="Attachment" />
                                            )}
                                            {message.video && (
                                                <video src={message.video} controls className="rounded-xl w-full max-w-[280px] h-auto mb-2 border border-black/5" />
                                            )}
                                            {message.file && (
                                                <a href={message.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 bg-black/5 hover:bg-black/10 rounded-xl mb-2 transition-colors cursor-pointer w-[200px] sm:w-[240px]">
                                                    <FontAwesomeIcon icon={faFileAlt} className={`text-2xl shrink-0 opacity-80 ${message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'}`} />
                                                    <span className="text-sm font-semibold truncate flex-1 underline decoration-transparent hover:decoration-current transition">Attachment File</span>
                                                </a>
                                            )}
                                            {message.audio && (
                                                <VoiceMessagePlayer src={message.audio} isMine={message.senderId === currentUser?.id} />
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

                            {/* ── Context Menu ── */}
                            {deleteMenuMsg && (
                                <div
                                    ref={deleteMenuRef}
                                    className="bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.08)] p-1.5 min-w-[200px] animate-[delete-menu-in_0.2s_cubic-bezier(0.16,1,0.3,1)]"
                                    style={{ position: 'fixed', top: deleteMenuPos.y, left: deleteMenuPos.x, zIndex: 100 }}
                                >
                                    <button className="flex items-center w-full px-3.5 py-2.5 border-none bg-transparent text-[13.5px] font-medium rounded-[10px] cursor-pointer transition-colors duration-150 text-left text-blue-500 hover:bg-blue-50" onClick={() => handleReply(deleteMenuMsg)}>
                                        <FontAwesomeIcon icon={faReply} className="mr-2.5 text-xs" />
                                        Reply
                                    </button>
                                    {deleteMenuMsg.senderId === currentUser?.id && (
                                        <button className="flex items-center w-full px-3.5 py-2.5 border-none bg-transparent text-[13.5px] font-medium rounded-[10px] cursor-pointer transition-colors duration-150 text-left text-red-500 hover:bg-red-50" onClick={() => deleteForEveryone(deleteMenuMsg)}>
                                            <FontAwesomeIcon icon={faTrash} className="mr-2.5 text-xs" />
                                            Delete for everyone
                                        </button>
                                    )}
                                    <button className="flex items-center w-full px-3.5 py-2.5 border-none bg-transparent text-[13.5px] font-medium rounded-[10px] cursor-pointer transition-colors duration-150 text-left text-amber-500 hover:bg-amber-50" onClick={() => deleteForMe(deleteMenuMsg)}>
                                        <FontAwesomeIcon icon={faTrash} className="mr-2.5 text-xs" />
                                        Delete for me
                                    </button>
                                    <button className="flex items-center w-full px-3.5 py-2.5 border-none bg-transparent text-[13.5px] font-medium cursor-pointer transition-colors duration-150 text-gray-500 justify-center mt-0.5 border-t border-gray-100 rounded-b-[10px] rounded-t-none hover:bg-gray-50" onClick={() => setDeleteMenuMsg(null)}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Premium Input Bar */}
                        <div className="p-3 sm:p-6 bg-white border-t border-gray-100 flex flex-col">
                            {/* ── Replying To Indicator ── */}
                            {replyingTo && (
                                <div className="mb-2 max-w-4xl mx-auto w-full animate-fade-in-up">
                                    <div className="bg-gray-50 flex items-center justify-between p-3 rounded-xl border border-gray-200 border-l-4 border-l-blue-500 relative shadow-sm">
                                        <div className="flex flex-col min-w-0 flex-1 pl-1">
                                            <span className="text-xs font-bold text-blue-600 mb-0.5">Replying to {replyingTo.senderName}</span>
                                            <span className="text-xs text-gray-500 truncate pr-4">{replyingTo.text}</span>
                                        </div>
                                        <button 
                                            onClick={() => setReplyingTo(null)}
                                            className="text-gray-400 hover:text-gray-600 p-2 transition-colors rounded-full hover:bg-gray-200"
                                            title="Cancel Reply"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="max-w-4xl mx-auto flex items-center space-x-2 sm:space-x-3 w-full">
                                {isRecording ? (
                                    /* ── Recording Strip ── */
                                    <div className="flex-1 flex items-center gap-3 bg-gradient-to-br from-red-50 to-rose-50 border-[1.5px] border-red-200 rounded-full py-2 pl-2 pr-3 animate-[fade-in-up_0.3s_ease-out]">
                                        <button onClick={cancelRecording} className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center cursor-pointer text-sm transition-all duration-150 shrink-0 hover:bg-red-200 hover:scale-[1.08]" title="Cancel">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[rec-pulse_1s_ease-in-out_infinite]" />
                                            <span className="text-[13px] font-semibold text-red-500">Recording</span>
                                        </div>
                                        <span className="text-sm font-bold text-red-700 tabular-nums min-w-[42px]">{formatRecTime(recordingTime)}</span>
                                        <div className="flex items-center justify-center gap-[2px] flex-1 h-6">
                                            {[...Array(12)].map((_, i) => (
                                                <span key={i} className="w-[3px] rounded-full bg-red-400 animate-[rec-bar-anim_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: `${i * 0.08}s` }} />
                                            ))}
                                        </div>
                                        <button onClick={stopRecording} className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer text-base shrink-0 shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-all duration-150 hover:bg-red-600 hover:scale-[1.06] active:scale-95" title="Send">
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                ) : (
                                    /* ── Normal Input ── */
                                    <>
                                    <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-3xl pl-3 sm:pl-4 pr-12 sm:pr-14 py-1.5 sm:py-2 relative transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:bg-white shadow-inner">
                                        <input
                                            id="chat-text-input"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            type="text"
                                            placeholder="Message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 text-sm font-medium py-2.5 sm:py-3 px-2 sm:px-4 placeholder-gray-400 outline-none w-full"
                                        />
                                        <div className="absolute right-2 sm:right-4 flex items-center bg-transparent">
                                            {uploading ? (
                                                <span className="text-xs text-blue-500 animate-pulse font-medium mr-1">...</span>
                                            ) : (
                                                <>
                                                <button 
                                                    onClick={startRecording}
                                                    className="cursor-pointer transition-colors p-1.5 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-600"
                                                >
                                                    <FontAwesomeIcon icon={faMicrophone} className="text-xl sm:text-2xl" />
                                                </button>
                                                <label className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors p-1.5 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faPaperclip} className="text-xl sm:text-2xl" />
                                                    <input 
                                                        type="file" 
                                                        accept="*/*" 
                                                        className="hidden" 
                                                        onChange={handleFileUpload}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button onClick={handleSend}
                                        className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full sm:rounded-2xl shadow-lg sm:shadow-xl shadow-blue-200 transition-all active:scale-95 group">
                                        <FontAwesomeIcon icon={faPaperPlane} className="group-hover:rotate-12 transition-transform text-sm sm:text-base" />
                                    </button>
                                    </>
                                )}
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
                @keyframes bar-bounce {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.25); }
                }
                @keyframes rec-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.8); }
                }
                @keyframes rec-bar-anim {
                    0% { height: 6px; }
                    100% { height: 20px; }
                }
                @keyframes delete-menu-in {
                    from { opacity: 0; transform: scale(0.9) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
