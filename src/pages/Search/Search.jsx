import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../component/Authcontext/Authcontext';
import Navbar from '../../component/Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router';
import FollowButton from '../../component/FollowButton/FollowButton';

export default function Search() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchPage(pageNum, append = false) {
    if (!token) return;
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/suggestions?page=${pageNum}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = data?.data?.suggestions || [];
      if (append) {
        setUsers(prev => {
          const ids = new Set(prev.map(u => u._id));
          return [...prev, ...list.filter(u => !ids.has(u._id))];
        });
      } else {
        setUsers(list);
      }
      setHasMore(list.length === 50);
    } catch (err) {
      console.error("Error fetching users for search:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (token) {
      setPage(1);
      fetchPage(1, false);
    }
  }, [token]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  }

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Header & Search Bar */}
          <div className="bg-indigo-600 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white relative z-10 mb-6 drop-shadow-md tracking-tight">
              Find People to Connect With
            </h1>
            <div className="relative max-w-xl mx-auto z-10">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 text-lg" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all font-medium"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="p-4 sm:p-6 bg-slate-50 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl mb-3 text-indigo-400" />
                <p className="font-semibold">Searching users...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <FontAwesomeIcon icon={faUser} className="text-4xl mb-3 text-slate-300" />
                    <p className="font-semibold">{search ? "No users matching your search." : "No users found."}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(user => (
                      <div key={user._id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                        <Link to={`/user/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0 font-medium group cursor-pointer hover:opacity-80 transition-opacity">
                          <img 
                            src={user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=6366f1&color=fff`} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shrink-0" 
                          />
                          <div className="truncate pr-2">
                            <p className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-indigo-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">@{user.name?.toLowerCase().replace(/\s+/g, "") || "user"}</p>
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2 shrink-0">
                          <FollowButton targetUserId={user._id} className="!w-full justify-center !text-[10px] sm:!text-xs py-1" />
                          <button 
                            onClick={() => navigate(`/chat?user=${user._id}`)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-xl transition-colors text-[10px] sm:text-xs"
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More Area */}
                {hasMore && (
                  <div className="flex justify-center mt-4 mb-2">
                    <button 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 text-sm flex items-center gap-2 shadow-sm"
                    >
                      {loadingMore ? (
                        <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Loading...</>
                      ) : (
                        <><FontAwesomeIcon icon={faUser} /> Load More People</>
                      )}
                    </button>
                  </div>
                )}
                
                {!hasMore && users.length > 0 && (
                   <p className="text-center text-sm font-medium text-slate-400 mt-4">You've reached the end of the list 🎉</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
