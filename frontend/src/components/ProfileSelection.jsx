import React, { useState } from 'react';
import Navbar from './Navbar';
import PetProfile from './PetProfile';
import dogProfilePic from './dogProfilePic.jpg';
import catProfilePic from './catProfilePic.jpeg';
import hamsterProfilePic from './hamster1.jpg';

const PetSelectionPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);

  // Mock data for pets (this would eventually come from database)
  const pets = [
    { id: 1, name: 'Diesel', image: dogProfilePic, type: 'dog', age: 8, weightData: [
        { date: '2023-05-01', weight: 50 },
        { date: '2023-05-15', weight: 55 },
        { date: '2023-06-01', weight: 52 },
        { date: '2023-06-15', weight: 57 }
      ]},
    { id: 2, name: 'Daisy', image: catProfilePic, type: 'cat', age:12, weightData: [
        { date: '2023-05-01', weight: 50 },
        { date: '2023-05-15', weight: 55 },
        { date: '2023-06-01', weight: 52 },
        { date: '2023-06-15', weight: 57 }
      ]},
    { id: 3, name: 'Derek', image: hamsterProfilePic, type: 'hamster', age: 14, weightData: [
        { date: '2023-05-01', weight: 50 },
        { date: '2023-05-15', weight: 55 },
        { date: '2023-06-01', weight: 52 },
        { date: '2023-06-15', weight: 57 }
      ]},
  ];

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
  };

  if (selectedPet) {
    return <PetProfile pet={selectedPet} />;
  }

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />

      <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12">
    {pets.map((pet) => (
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