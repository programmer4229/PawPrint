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

  // for adding a pet
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    dateOfBirth: '',
    careInstructions: '',
    ownerId: userId,
    userId: userId,
    image: null,
  });
  const [statusMessage, setStatusMessage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPetData({
      name: '',
      type: '',
      breed: '',
      dateOfBirth: '',
      careInstructions: '',
      ownerId: userId,
      userId: userId,
      image: null,
    });
    setStatusMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  // when adding pet
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPetData({ ...petData, image: file });
  };  

  const handleAddPet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      const formData = new FormData();
      Object.keys(petData).forEach((key) => {
        if (key !== 'image') {
          formData.append(key, petData[key]);
        }
      });
  
      if (petData.image) {
        formData.append('image', petData.image); // Add image file
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pets/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setPets((prevPets) => [...prevPets, response.data.pet]); // Add new pet to the existing state
      setStatusMessage('Pet added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error adding pet:', error);
      setStatusMessage('Failed to add pet. Please try again.');
    }
  };

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
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 mb-2 cursor-pointer flex items-center justify-center bg-white"
              onClick={openModal}  // add pet button
            >
              <span className="text-4xl text-gray-400">+</span>

            </div>
        <p className="text-lg font-semibold">Add Pet</p>
        
        {/* Add Pet Button */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add a New Pet</h2>
              <form onSubmit={handleAddPet}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={petData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={petData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="e.g., dog or cat"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={petData.breed}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={petData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Care Instructions</label>
                  <textarea
                    name="careInstructions"
                    value={petData.careInstructions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Provide any special care instructions"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Upload Pet's Image</label>
                  <input type="file" onChange={handleImageUpload} />
                </div>
                {statusMessage && (
                  <p className="text-center text-green-500 mb-4">{statusMessage}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default PetSelectionPage;