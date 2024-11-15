import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import PetProfile from './PetProfile';
import { AuthContext } from '../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dogProfileImage from './dogProfilePic.jpg';
import catProfileImage from './catProfilePic.jpeg';


const PetSelectionPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const auth = useContext(AuthContext);
  const { email, userId, userName } = auth;
  // console.log("User's name from AuthContext:", userName);
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [sharedPets, setSharedPets] = useState([]);  // pet profiles shared with user

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log("Retrieved token from localStorage:", token);

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'userId': userId  // Add user ID to the header
          },
          params: { email: auth.email }
        };

        // Fetch user's own pets
        const ownPetsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/get`, config);
        setPets(ownPetsResponse.data);
        // console.log("Own pets:", ownPetsResponse.data);

        // Fetch shared pets
        const sharedPetsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/shared`, config);
        setSharedPets(sharedPetsResponse.data);
        // console.log("Shared pets:", sharedPetsResponse.data);
      } catch (error) {
          console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, [email, userId]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    navigate(`/petprofile/${pet.id}`); // Pass the pet ID in the route
  };

  const isSharedPet = (pet) => sharedPets.some(shared => shared.id === pet.id);

  if (selectedPet) {
    return <PetProfile pet={selectedPet} />;
  }

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar name={userName} />

      <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
          {(pets.length === 0 && sharedPets.length === 0) ? <p className="text-lg font-semibold">No pets found</p> : [...pets, ...sharedPets].map((pet) => (
            <div key={pet.id} className="flex flex-col items-center" onClick={() => handlePetClick(pet)}>
              <div className={`w-32 h-32 rounded-full overflow-hidden mb-2 cursor-pointer
                  ${isSharedPet(pet) ? 'border-purple-500' : 'border-orange-500'} border-4`}>
                <img
                  src={
                    pet.image 
                        ? `data:image/jpeg;base64,${pet.image}`
                        : pet.type.toLowerCase() === 'dog'
                            ? dogProfileImage
                            : catProfileImage
                  }
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-semibold">{pet.name}</p>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 mb-2 cursor-pointer flex items-center justify-center bg-white">
              <span className="text-4xl text-gray-400">+</span>
            </div>
            <p className="text-lg font-semibold">Add Pet</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PetSelectionPage;