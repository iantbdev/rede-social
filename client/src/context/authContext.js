import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (inputs) => {
    const resp = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(resp.data);
    localStorage.setItem("user", JSON.stringify(resp.data));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    console.log("Current user state updated.");
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};