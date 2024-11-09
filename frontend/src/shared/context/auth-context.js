import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  email: null,
  userId: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedUserId = localStorage.getItem("userId");

    if (storedEmail && storedUserId) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
      setUserId(storedUserId);
    }
  }, []);

  const login = (userEmail, userId) => {
    setIsLoggedIn(true);
    setEmail(userEmail);
    setUserId(userId);
    localStorage.setItem("userEmail", userEmail); // Store in localStorage for persistence
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail(null);
    setUserId(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
