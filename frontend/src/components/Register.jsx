import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SignIn from './SignIn';


function Register() {
    const navigate = useNavigate();
    const [showSignIn, setShowSignIn] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cfmpassword, setCfmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);  // for loading modal

    if (showSignIn) {
        navigate('/signin');
        return <SignIn />;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        const rawPhone = phone.replace(/\D/g, ""); // Remove formatting to get raw digits
        if (rawPhone.length < 10) {
            setMessage("Phone number must be 10 digits long.");
            return;
        }

        if (password !== cfmpassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            setIsLoading(true); // Show loading modal

            // Check email uniqueness
            const checkEmailResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!checkEmailResponse.ok) {
                const errorData = await checkEmailResponse.json();
                throw new Error(errorData.message || "Email is already linked to another account.");
            }

            // Proceed with registration if email is unique
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    address,
                    userType  // user type: owner || vet
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false); // hide loading modal
            setShowSuccessModal(true);
            setTimeout(() => handleModalClose(), 2500);
        } catch (error) {
            setIsLoading(false); // hide loading modal
            console.log(error);
            setMessage("Registration failed: " + error.message);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/signin'); // Redirect to Sign In page
    };

    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Register</h2>
                    
                    {/* Form fields */}
                    <form className="space-y-4" onSubmit={submitHandler}>
                        {/* Name Field */}
                        <div className="form-control">
                            <input 
                                type="name" 
                                placeholder="Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-control">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={async (e) => {
                                    try {
                                        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/check-email`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ email: e.target.value }),
                                        });

                                        if (!response.ok) {
                                            const errorData = await response.json();
                                            e.target.setCustomValidity(errorData.message || "Email is already linked to another account.");
                                        } else {
                                            e.target.setCustomValidity(""); // Clear the validation message if email is valid
                                        }
                                    } catch (error) {
                                        console.error("Error checking email:", error);
                                        e.target.setCustomValidity("Server error. Please try again.");
                                    }
                                }}
                                onInput={(e) => e.target.setCustomValidity("")} // Clear the message while the user is typing
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>
                        
                        {/* Phone Field */}
                        <div className="form-control">
                            <input 
                                type="phone" 
                                placeholder="Phone" 
                                value={phone}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                    let formattedValue = rawValue;

                                    // Format as (###) ###-####
                                    if (rawValue.length > 3 && rawValue.length <= 6) {
                                        formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
                                    } else if (rawValue.length > 6) {
                                        formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6, 10)}`;
                                    }

                                    setPhone(formattedValue);
                                }}
                                onBlur={(e) => {
                                    const rawValue = phone.replace(/\D/g, "");
                                    if (rawValue.length < 10) {
                                        e.target.setCustomValidity("Phone number must be 10 digits long.");
                                    } else {
                                        e.target.setCustomValidity(""); // Clear the message if valid
                                    }
                                }}
                                onInput={(e) => e.target.setCustomValidity("")} // Clear the custom message when editing
                                maxLength="14" // Max length for the formatted phone number
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Address Field */}
                        <div className="form-control">
                            <input 
                                type="address" 
                                placeholder="Address" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* User Type Field */}
                        {/* Dropdown for User Type */}
                        <div className="form-control">
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-500">
                                User Type
                            </label>
                            <select
                                name="userType"
                                value={userType}  // Default to "Owner" if no value is selected
                                onChange={(e) => setUserType(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="" disabled>-- Select a user type --</option> {/* Placeholder option */}
                                <option value="Owner">Owner</option>
                                <option value="Veterinarian">Veterinarian</option>
                            </select>
                        </div>
                        
                        {/* Password Field */}
                        <div className="form-control relative">
                            {/* Password Field */}
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        <div className="form-control relative">
                            {/* Confirm Password Field */}
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                value={cfmpassword}
                                onChange={(e) => {
                                    setCfmPassword(e.target.value);
                                    if (e.target.value !== password) {
                                        e.target.setCustomValidity("Passwords do not match!");
                                    } else {
                                        e.target.setCustomValidity("");
                                    }
                                }}
                                onInput={(e) => e.target.setCustomValidity("")} // Clear the validation message
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        
                        {/* Submit Field */}
                        <button 
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Message display */}
                    {message && (
                        <p className="text-center text-red-600 mt-4">{message}</p>
                    )}
                    
                    <div className="mt-6 flex items-center justify-center space-x-2">
                        <span className="text-gray-600">Already have an account?</span>
                        <button 
                            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:underline" 
                            onClick={() => navigate('/signin')}
                        >
                            Login!
                        </button>
                    </div>

                    {/* Loading Modal */}
                    {isLoading && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                                <h2 className="text-2xl font-bold text-orange-500 mb-4">Registering User...</h2>
                                <p>Please wait while we process your registration.</p>
                            </div>
                        </div>
                    )}

                    {/* Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                                <h2 className="text-2xl font-bold text-green-500 mb-4">Registration Successful</h2>
                                <p>Welcome to PawPrint, {name}!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
