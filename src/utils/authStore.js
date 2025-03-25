import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

// Function to get cookie value
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

// Zustand Store for Authentication
const useAuthStore = create((set, get) => ({
    isAuthenticated: !!getCookie("access_token"),
    accessToken: getCookie("access_token"),
    tokenExpiry: null,  // Store expiry time

    setAuthenticated: (accessToken, refreshToken, tokenType, expiresIn) => {
        const decoded = jwtDecode(accessToken);
        const expiryTime = decoded.exp * 1000;

        document.cookie = `access_token=${accessToken}; max-age=${expiresIn}; path=/; secure; samesite=strict`;
        document.cookie = `refresh_token=${refreshToken}; max-age=86400; path=/; secure; samesite=strict`;
        document.cookie = `token_type=${tokenType}; max-age=86400; path=/; secure; samesite=strict`;

        set({ isAuthenticated: true, accessToken, tokenExpiry: expiryTime });

        get().scheduleTokenExpiration();
    },

    getAccessToken: () => getCookie("access_token"),

    logout: () => {
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        set({ isAuthenticated: false, accessToken: null, tokenExpiry: null });
    },

    scheduleTokenExpiration: () => {
        const { tokenExpiry, logout } = get();
        if (!tokenExpiry) return;

        const currentTime = Date.now();
        const timeLeft = tokenExpiry - currentTime;

        if (timeLeft > 0) {
            setTimeout(() => {
                logout();
            }, timeLeft);
        } else {
            logout();
        }
    },
}));

export default useAuthStore;
