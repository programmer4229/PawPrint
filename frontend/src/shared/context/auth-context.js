import { createContext, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  email: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);

  const login = (userEmail, userId) => {
    setIsLoggedIn(true);
    setEmail(userEmail);
    setId(userId);
    localStorage.setItem("userEmail", userEmail); // Optional: store in localStorage for persistence
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail(null);
    localStorage.removeItem("userEmail");
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
