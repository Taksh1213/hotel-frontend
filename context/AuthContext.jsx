"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

const AuthContext = createContext(null);

// Idle configurations (in milliseconds)
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes of total inactivity
const WARNING_DURATION = 30 * 1000; // 30 seconds warning modal countdown
const INACTIVITY_LIMIT = IDLE_TIMEOUT - WARNING_DURATION; // 4.5 minutes before warning

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inactivity tracking states
  const [isIdleWarningOpen, setIsIdleWarningOpen] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState(30);

  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Helper to decode JWT payload safely
  const decodeJWT = (tokenStr) => {
    try {
      const base64Url = tokenStr.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Helper to check if token is expired
  const isTokenExpired = (tokenStr) => {
    const decoded = decodeJWT(tokenStr);
    if (!decoded || !decoded.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  };

  /* ==========================================
     LOGOUT FUNCTION
     ========================================== */
  const logout = () => {
    // Clear tokens and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Reset State
    setToken(null);
    setUser(null);
    setIsIdleWarningOpen(false);

    // Clear Timers
    clearAllTimers();

    // Redirect to login
    router.push("/login");
  };

  const clearAllTimers = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  /* ==========================================
     INACTIVITY TIMER LOGIC
     ========================================== */
  const startInactivityTracker = () => {
    clearAllTimers();
    setIsIdleWarningOpen(false);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    // Start timer for the inactivity limit (e.g. 4.5 minutes)
    inactivityTimerRef.current = setTimeout(() => {
      triggerIdleWarning();
    }, INACTIVITY_LIMIT);
  };

  const triggerIdleWarning = () => {
    setIsIdleWarningOpen(true);
    setIdleCountdown(Math.round(WARNING_DURATION / 1000));

    // Countdown interval updates countdown state every second
    let remainingSeconds = Math.round(WARNING_DURATION / 1000);
    countdownIntervalRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setIdleCountdown(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(countdownIntervalRef.current);
        logout();
      }
    }, 1000);
  };

  const stayLoggedIn = () => {
    startInactivityTracker();
  };

  // Listeners for user activity
  const resetTimerOnActivity = () => {
    // Only reset if the warning popup is not yet open
    // If warning popup is open, user must manually click "Stay Logged In"
    if (!isIdleWarningOpen) {
      startInactivityTracker();
    }
  };

  /* ==========================================
     INITIAL LOGIN / REGISTER HELPER
     ========================================== */
  const initializeAuth = (authToken, userData) => {
    localStorage.setItem("token", authToken);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setToken(authToken);
    setUser(userData);
    startInactivityTracker();
  };

  /* ==========================================
     FETCH CURRENT PROFILE FROM BACKEND
     ========================================== */
  const fetchUserProfile = async (storedToken) => {
    try {
      const { data } = await API.get("/user/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (data) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  /* ==========================================
     EFFECTS
     ========================================== */
  // Initial startup: check token validity, expiry, and start activity listeners
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
        setLoading(false);
        return;
      }

      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Fetch fresh profile in background
      fetchUserProfile(storedToken);

      // Start inactivity tracker
      startInactivityTracker();
    }

    setLoading(false);

    // Attach activity listeners
    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    
    // Throttle helper to avoid performance lag
    let throttleTimeout = null;
    const throttledReset = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        resetTimerOnActivity();
        throttleTimeout = null;
      }, 2000); // Only reset timer once every 2 seconds on continuous events
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, throttledReset);
    });

    // Synchronize logout across tabs
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        logout();
      } else if (e.key === "token" && e.newValue) {
        setToken(e.newValue);
        const freshUser = localStorage.getItem("user");
        if (freshUser) setUser(JSON.parse(freshUser));
        startInactivityTracker();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearAllTimers();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, throttledReset);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isIdleWarningOpen]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initializeAuth,
        logout,
        isIdleWarningOpen,
        idleCountdown,
        stayLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
