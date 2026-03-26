import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Authcontext/Authcontext";
import FollowButton from "../FollowButton/FollowButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSearch, faRotateRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const LIMIT = 50;

function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="size-10 rounded-2xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-slate-200 rounded-full w-3/4" />
        <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
      </div>
      <div className="h-7 w-20 bg-slate-200 rounded-xl shrink-0" />
    </div>
  );
}

export default function PeopleSidebar() {
  const { token } = useContext(AuthContext);
  const [users, setUsers]             = useState([]);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [loading, setLoading]         = useState(true);      // initial skeleton
  const [loadingMore, setLoadingMore] = useState(false);     // "load more" spinner
  const [search, setSearch]           = useState("");

  // Fetch a page; append=true adds to the list, append=false replaces it
  async function fetchPage(pageNum, append = false) {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/suggestions?page=${pageNum}&limit=${LIMIT}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = data?.data?.suggestions || [];

      if (append) {
        setUsers((prev) => {
          const ids = new Set(prev.map((u) => u._id));
          return [...prev, ...list.filter((u) => !ids.has(u._id))];
        });
      } else {
        setUsers(Array.isArray(list) ? list : []);
      }

      // If fewer results than LIMIT came back, no more pages exist
      setHasMore(list.length === LIMIT);
    } catch (err) {
      console.error("PeopleSidebar: failed to fetch suggestions", err);
      if (!append) setUsers([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Initial load
  useEffect(() => {
    if (token) {
      setPage(1);
      setHasMore(true);
      fetchPage(1, false);
    }
  }, [token]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  }

  function handleRefresh() {
    setPage(1);
    setHasMore(true);
    setUsers([]);
    fetchPage(1, false);
  }

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm shadow-md shadow-indigo-200">
            <FontAwesomeIcon icon={faUsers} />
          </span>
          <h2 className="font-extrabold text-slate-800 text-sm tracking-tight flex-1">
            People to Follow
          </h2>
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className={`text-xs ${loading ? "animate-spin" : ""}`}
            />
          </button>
          {/* Total count badge */}
          <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
            {loading ? "…" : users.length}
          </span>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs"
            />
            <input
              type="text"
              placeholder="Search people…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
        </div>

        {/* User list */}
        <div className="divide-y divide-slate-50 max-h-[calc(100vh-240px)] overflow-y-auto">
          {loading ? (
            <>
              <UserSkeleton /><UserSkeleton /><UserSkeleton />
              <UserSkeleton /><UserSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-slate-400 text-xs font-medium">
                {search ? "No users match your search." : "No suggestions found."}
              </p>
            </div>
          ) : (
            <>
              {filtered.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        user.photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=6366f1&color=fff`
                      }
                      alt={user.name}
                      className="size-10 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/user/${user._id}`} className="block hover:underline decoration-indigo-200 underline-offset-2">
                      <p className="font-bold text-xs text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate font-medium">
                        @{user.name?.toLowerCase().replace(/\s+/g, "") || "user"}
                      </p>
                    </Link>
                  </div>

                  {/* Follow / Unfollow */}
                  <FollowButton targetUserId={user._id} />
                </div>
              ))}

              {/* Skeleton rows while loading next page */}
              {loadingMore && (
                <>
                  <UserSkeleton /><UserSkeleton /><UserSkeleton />
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-4 py-3 border-t border-slate-50 text-center">
            {hasMore && !search ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
              >
                <FontAwesomeIcon
                  icon={loadingMore ? faRotateRight : faChevronDown}
                  className={`text-[10px] transition-transform ${
                    loadingMore ? "animate-spin" : "group-hover:translate-y-0.5"
                  }`}
                />
                {loadingMore ? "Loading…" : "Load more people"}
              </button>
            ) : (
              <p className="text-[11px] text-slate-300 font-medium">
                {search
                  ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
                  : "You've seen everyone 🎉"}
              </p>
            )}
          </div>
        )}

      </div>
    </aside>
  );
}
