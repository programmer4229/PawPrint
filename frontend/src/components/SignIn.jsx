import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PetProfile from './PetProfile';
import PetSelectionPage from './ProfileSelection';
import { AuthContext } from '../shared/context/auth-context';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const login = useCallback(() => {
        auth.login();
    }
    , [auth]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:51007/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            }
            console.log("Successfully Logged In");
            login();
            navigate('/petselection');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Log In</h2>
                    <form className="space-y-4" onSubmit={submitHandler}>
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
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            Sign In
                        </button>
                    </form>
                    
                    <div className="mt-6 flex items-center justify-center space-x-2">
                        <span className="text-gray-600">New to PawPrint?</span>
                        <button 
                            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:underline"
                        >
                            Register here!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;