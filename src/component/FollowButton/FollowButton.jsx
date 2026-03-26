import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useFollow from "../../utils/useFollow";

export default function FollowButton({ targetUserId, initiallyFollowing = false, className = "" }) {
  const { isFollowing, toggleFollow, loading } = useFollow(targetUserId, initiallyFollowing);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFollow();
      }}
      disabled={loading}
      className={`
        inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl
        transition-all duration-200 active:scale-95 cursor-pointer shrink-0
        ${isFollowing
          ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 border border-slate-200 hover:border-red-200"
          : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-200"
        }
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      title={isFollowing ? "Unfollow" : "Follow"}
    >
      {loading
        ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[11px]" />
        : <FontAwesomeIcon icon={isFollowing ? faUserCheck : faUserPlus} className="text-[11px]" />
      }
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </button>
  );
}
