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
    const [cfmpassword, setCfmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState('');

    if (showSignIn) {
        navigate('/signin');
        return <SignIn />;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== cfmpassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
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
            console.log("Successfully Registered");
            setMessage("Successfully Registered! Redirecting to Sign In...");
            setShowSignIn(true);
            return <SignIn />;
        } catch (error) {
            console.log(error);
            setMessage("Registration failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Register</h2>
                    
                    <form className="space-y-4" onSubmit={submitHandler}>
                        {/* Form fields */}
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

                        <div className="form-control">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="phone" 
                                placeholder="Phone" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

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

                        {/* Dropdown for User Type */}
                        <div className="form-control">
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-500">
                                User Type
                            </label>
                            <select
                                name="userType"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="Owner">Owner</option>
                                <option value="Veterinarian">Veterinarian</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={cfmpassword}
                                onChange={(e) => setCfmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>
                        
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
                </div>
            </div>
        </div>
    );
}

export default Register;
