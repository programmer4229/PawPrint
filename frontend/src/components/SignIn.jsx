import React, { useState } from 'react';
import Navbar from './Navbar';
import PetProfile from './PetProfile';
import PetSelectionPage from './ProfileSelection';

function SignIn() {
    const [showPetProfile, setShowPetProfile] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        // In a real application, you would validate the credentials here
        // For this example, we'll just show the PetProfile
        setShowPetProfile(true);
    };

    if (showPetProfile) {
        return <PetSelectionPage />;
    }

    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Log In</h2>
                    <form className="space-y-4" onSubmit={handleSignIn}>
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