import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};

const useAuthStore = create((set, get) => ({
    isAuthenticated: false,
    accessToken: null,
    tokenExpiry: null,
    refreshToken: null,
    tokenType: null,

    initialize: () => {
        const accessToken = getCookie("access_token");
        if (!accessToken) return;

        try {
            const decoded = jwtDecode(accessToken);
            const expiryTime = decoded.exp * 1000;
            const currentTime = Date.now();

            set({
                isAuthenticated: currentTime < expiryTime,
                accessToken,
                tokenExpiry: expiryTime,
                refreshToken: getCookie("refresh_token"),
                tokenType: getCookie("token_type")
            });

            if (currentTime < expiryTime) {
                get().scheduleTokenExpiration();
            } else {
                get().logout();
            }
        } catch (error) {
            console.error("Token decoding failed:", error);
            get().logout();
        }
    },

    setAuthenticated: (accessToken, refreshToken, tokenType, expiresIn) => {
        try {
            const decoded = jwtDecode(accessToken);
            const expiryTime = decoded.exp * 1000;

            const cookieSettings = `path=/; samesite=strict${window.location.protocol === 'https:' ? '; secure' : ''}`;
            
            document.cookie = `access_token=${encodeURIComponent(accessToken)}; max-age=${expiresIn}; ${cookieSettings}`;
            document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; max-age=86400; ${cookieSettings}`;
            document.cookie = `token_type=${encodeURIComponent(tokenType)}; max-age=86400; ${cookieSettings}`;

            set({ 
                isAuthenticated: true, 
                accessToken, 
                refreshToken,
                tokenType,
                tokenExpiry: expiryTime 
            });

            get().scheduleTokenExpiration();
        } catch (error) {
            console.error("Token decoding failed:", error);
            get().logout();
        }
    },

    getAccessToken: () => get().accessToken || getCookie("access_token"),

    logout: () => {
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        set({ 
            isAuthenticated: false, 
            accessToken: null, 
            refreshToken: null,
            tokenType: null,
            tokenExpiry: null 
        });
    },

    scheduleTokenExpiration: () => {
        const { tokenExpiry, logout } = get();
        if (!tokenExpiry) return;

        const currentTime = Date.now();
        const timeLeft = tokenExpiry - currentTime;

        if (timeLeft <= 0) {
            logout();
            return;
        }

        // Schedule refresh 1 minute before expiration
        const refreshTime = Math.max(timeLeft - 60000, 0);
        
        setTimeout(() => {
            console.log("Token about to expire, should refresh now");
        }, refreshTime);

        setTimeout(() => {
            logout();
        }, timeLeft);
    },
}));

useAuthStore.getState().initialize();

export default useAuthStore;