import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../component/Authcontext/Authcontext";
import { toast } from "react-toastify";

/**
 * useFollow – manages follow / unfollow state for a single target user.
 * Calls POST /users/:userId/follow  (API toggles follow state automatically)
 */
export default function useFollow(targetUserId, initiallyFollowing = false) {
  const { token } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    if (!token || !targetUserId || loading) return;

    const wasFollowing = isFollowing; // capture before optimistic update
    setIsFollowing(!wasFollowing);
    setLoading(true);

    try {
      await axios.request({
        url: `https://route-posts.routemisr.com/users/${targetUserId}/follow`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(wasFollowing ? "Unfollowed successfully" : "Following now! 🎉");
    } catch (error) {
      setIsFollowing(wasFollowing); // revert on error
      const msg = error.response?.data?.message || "Could not update follow status.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { isFollowing, toggleFollow, loading };
}
