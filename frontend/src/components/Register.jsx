import React, { useState } from 'react';
import Navbar from './Navbar';
import SignIn from './SignIn';

function Register() {
    const [showSignIn, setShowSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cfmpassword, setCfmPassword] = useState('');

    const handleRegistration = (e) => {
        e.preventDefault();
        // In a real application, you would validate the credentials here
        // For this example, we'll just show the SignIn
        setShowSignIn(true);
    };

    if (showSignIn) {
        return <SignIn />;
    }

    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Register</h2>
                    <form className="space-y-4" onSubmit={handleRegistration}>
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
                                type="username" 
                                placeholder="Username" 
                                value={email}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
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
                                type="cfmpassword" 
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
                    
                    <div className="mt-6 flex items-center justify-center space-x-2">
                        <span className="text-gray-600">Already have an account?</span>
                        <button 
                            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:underline" 
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