import React, { useState } from 'react';
import Navbar from './Navbar';
import PetProfile from './PetProfile';

function AddPetProfile() {
    const [showPetProfile, setShowPetProfile] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [chipid, setChipID] = useState('');
    const [type, setType] = useState('');
    const [breed, setBreed] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [careInstructions, setCareInstructions] = useState('');
    const [adoptionStatus, setAdoptionStatus] = useState('');
    const [weight, setWeight] = useState('');

    const handleAddingPet = (e) => {
        e.preventDefault();
        // In a real application, you would validate the credentials here
        // For this example, we'll just show the SignIn
        setShowPetProfile(true);
    };

    if (showPetProfile) {
        return <PetProfile />;
    }

    return (
        <div className="min-h-screen bg-orange-100">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-16">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Add Your Pet!</h2>
                    <form className="space-y-4" onSubmit={handleAddingPet}>
                        <div className="form-control">
                            <input 
                                type="image" 
                                placeholder="Image" 
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

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
                                type="chipid" 
                                placeholder="Chip ID" 
                                value={chipid}
                                onChange={(e) => setChipID(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="type" 
                                placeholder="Species" 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="breed" 
                                placeholder="Breed" 
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="dateofbirth" 
                                placeholder="DateOfBirth" 
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="ownerId" 
                                placeholder="OwnerId" 
                                value={ownerId}
                                onChange={(e) => setOwnerId(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="careInstructions" 
                                placeholder="CareInstructions" 
                                value={careInstructions}
                                onChange={(e) => setCareInstructions(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="adoptionStatus" 
                                placeholder="AdoptionStatus" 
                                value={adoptionStatus}
                                onChange={(e) => setAdoptionStatus(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <input 
                                type="weight" 
                                placeholder="Weight" 
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            Add Pet
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPetProfile;