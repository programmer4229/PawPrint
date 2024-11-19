import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  email: null,
  userId: null,
  name: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState(null);

  // Load from localStorage on component mount
  useEffect(() => {
    // console.log("AuthProvider useEffect triggered.");

    const storedEmail = localStorage.getItem("userEmail");
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedUserType = localStorage.getItem("userType");

    // console.log("Stored values on component mount:", { storedEmail, storedUserId, storedUserName, storedUserType });

    if (storedEmail && storedUserId) {
        setIsLoggedIn(true);
        setEmail(storedEmail);
        setUserId(storedUserId);
        setUserName(storedUserName);
        setUserType(storedUserType);
    }
}, []);

  const login = (userEmail, userId, userName, userType, token) => {
    // console.log("TEST:login function called with:", { userEmail, userId, userName, userType, token });

    setIsLoggedIn(true);
    setEmail(userEmail);
    setUserId(userId);
    setUserName(userName);
    setUserType(userType);

    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    // console.log("TEST: User type saved to localStorage:", localStorage.getItem("userType"));
};

  const logout = () => {
    setIsLoggedIn(false);
    console.log("isLoggedIn:", isLoggedIn);
    setEmail(null);
    setUserId(null);
    setUserName(null);
    setUserType(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, userId, userName, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
