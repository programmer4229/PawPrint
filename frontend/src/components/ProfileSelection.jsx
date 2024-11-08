import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import PetProfile from './PetProfile';
import { AuthContext } from '../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';

const PetSelectionPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const auth = useContext(AuthContext);
  const { email, isLoggedIn } = auth;
  const navigate = useNavigate();

  console.log("AuthContext values in ProfileSelection:", { isLoggedIn, email }); // Debugging log

  const [pets, setPets] = useState([]);

  const fetchPetData = async () => {
    if (!email) return;
    try {
      const response = await fetch(`http://localhost:51007/pets/get?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log('Fetched pets data:', data);
  
      // Check if the response is an array; if not, handle as an empty array or error
      setPets(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) {
        console.log("No pets found or an error occurred:", data.message || data);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };  

  useEffect(() => {
    if (isLoggedIn && email) {
      fetchPetData();
    }
  }, [isLoggedIn, email]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    navigate(`/petprofile/${pet.id}`); // Pass the pet ID in the route
  };

  if (selectedPet) {
    return <PetProfile pet={selectedPet} />;
  }

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />

      <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
    {pets.length === 0 ? <p className="text-lg font-semibold">No pets found</p> : pets.map((pet) => (
      <div key={pet.id} className="flex flex-col items-center" onClick={() => handlePetClick(pet)}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 mb-2 cursor-pointer">
          <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
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