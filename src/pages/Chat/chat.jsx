import React, { useEffect, useState, useContext } from 'react';
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
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../component/Authcontext/Authcontext';

export default function Chat() {
    const [lastUsers, setLastUsers] = useState([]);
    const { token } = useContext(AuthContext);

    async function getlatestusers() {
        if (!token) return;
        try {
            const { data } = await axios.get(
                "https://linked-posts.routemisr.com/posts?limit=50",
                {
                    headers: { token }
                }
            )
            const totalPages = data.paginationInfo.numberOfPages
            const options = {
                url: `https://linked-posts.routemisr.com/posts?limit=50&page=${totalPages}`,
                method: 'GET',
                headers: { token }
            }
            const lastPost = await axios.request(options)
            const posts = lastPost.data.posts;

            // Filter unique users by their _id
            const uniqueUsersMap = new Map();
            posts.forEach(post => {
                if (post.user && post.user._id && !uniqueUsersMap.has(post.user._id)) {
                    uniqueUsersMap.set(post.user._id, {
                        ...post.user,
                        lastMsg: post.body.substring(0, 30) + (post.body.length > 30 ? "..." : ""),
                        time: new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }
            });

            setLastUsers(Array.from(uniqueUsersMap.values()));

        } catch (error) {
            console.error("Error fetching latest users:", error);
        }
    }

    useEffect(() => {
        getlatestusers();
    }, [token]);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get(
                    "https://linked-posts.routemisr.com/users/profile-data",
                    { headers: { token } }
                );
                if (data.user) {
                    setCurrentUser({
                        id: data.user._id,
                        name: data.user.name,
                        photo: data.user.photo
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

    const filteredUsers = lastUsers.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSend = async () => {
        if (!currentUser) return alert("User not loaded yet!");
        if (!selectedUser) return alert("Select a user first!");
        if (!text.trim()) return;

        try {
            await sendMessage(selectedUser._id, text, currentUser.id);
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-['Inter',_sans-serif]">
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
                            <button

                                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:scale-110 transition-transform cursor-pointer">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
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
                                    <div className="relative flex-shrink-0">
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
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <p className="text-gray-500 font-medium">No messages found</p>
                                <p className="text-gray-400 text-xs">Try searching for someone else.</p>
                            </div>
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

                                <div className="relative flex-shrink-0 cursor-pointer group">
                                    <img
                                        src={selectedUser?.photo || selectedUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-blue-100 transition-all"
                                        alt={selectedUser?.name}
                                    />
                                    {selectedUser?.online && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="ml-4 truncate">
                                    <h2 className="text-lg font-extrabold text-gray-900 truncate tracking-tight">{selectedUser?.name}</h2>
                                    <div className="flex items-center space-x-1.5">
                                        <span className={`w-2 h-2 rounded-full ${selectedUser?.online ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <p className="text-xs font-semibold text-gray-400">{selectedUser?.online ? 'Online now' : 'Away'}</p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Dynamic Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed overflow-x-hidden scrollbar-hide">
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
                                            <span className={`text-[10px] mt-2 block font-semibold ${message.senderId === currentUser?.id ? 'text-blue-100 text-right' : 'text-gray-400'}`}>
                                                {message.time || (message.createdAt?.seconds ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Premium Input Bar */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="max-w-4xl mx-auto flex items-center space-x-3">
                                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-3xl px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 focus-within:bg-white shadow-inner">
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
                                </div>
                                <button onClick={handleSend}
                                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 group">
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
