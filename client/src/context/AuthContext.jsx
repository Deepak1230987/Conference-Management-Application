import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the auth context
const AuthContext = createContext();

const API_URL = "/ictacem2025"; // App runs under /ictacem2025 subdirectory
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and provides auth context value
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });

        if (res.data) {
          // Ensure role is available directly on the user object
          setUser(res.data);
          // console.log("User authenticated:", res.data);
          // console.log("User role:", res.data.role);
        }
      } catch (err) {
        // User is not logged in or token is invalid - this is not an error case
        console.log("User not authenticated", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );

      // Ensure role is directly accessible
      setUser(res.data);
      // console.log("Login successful, user data:", res.data);
      // console.log("User role after login:", res.data.role);
      // return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post("/api/auth/register", userData, {
        withCredentials: true,
      });

      setUser(res.data);
      console.log("Registration successful, user data:", res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Failed to logout");
      throw err;
    }
  };

  // Value provided to consuming components
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
