import { jwtDecode } from "jwt-decode"

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) return null;

    const decoded = jwtDecode(token);
    console.log("Full decoded token keys:", Object.keys(decoded));
    console.log("Full decoded token:", decoded);

    return {
        id: decoded.id || decoded._id || decoded.user_id || decoded.sub || decoded.user?._id,
        name: decoded.name || decoded.user?.name
    }
}