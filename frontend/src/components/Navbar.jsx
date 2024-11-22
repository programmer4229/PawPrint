import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../shared/context/auth-context";

const Navbar = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userName, userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuButtonRef = useRef(null); // Reference to the menu button
  const [dropdownStyles, setDropdownStyles] = useState({}); // Dynamic dropdown styles

  const toggleMenu = () => {
    if (!isMenuOpen && menuButtonRef.current) {
      const buttonRect = menuButtonRef.current.getBoundingClientRect(); // Get button position
      setDropdownStyles({
        position: 'absolute',
        top: `${buttonRect.bottom + window.scrollY}px`, // Align below the button
        left: `${buttonRect.right - 192}px`, // Align with the button's right edge minus dropdown width (192px)
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
    navigate(0);  // Force reload to clear any cached data
  };  

  return (
    <nav className="bg-orange-500 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to='/'><h1 className="text-2xl font-bold">PawPrint</h1></Link>
          </div>
          <div className="flex items-center">
            <span className="text-white font-semibold">{userName || 'Welcome!'}</span>
            <button
            ref={menuButtonRef}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-md text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="absolute top-16 right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          style={dropdownStyles} // Adjust '12px' to match the exact alignment
        >
          {userType === 'Owner' && (
            <div
              className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-900"
            >
              <Link to="/petselection">Pet Profiles</Link>
            </div>
          )}
          <button
            className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-900 cursor-pointer"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;