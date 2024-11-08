import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import NutritionTab from './NutritionTab';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';

// Helper function to calculate age
const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A'; // Handle missing birth date
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  // Adjust for cases where the month difference is negative
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} years, ${months} months`;
};

const PetProfile = () => {
  const [activeTab, setActiveTab] = useState('medical');

  // Default values if pet data is missing
  const defaultPet = {
    name: 'Default Name',
    image: '/placeholder.svg?height=128&width=128',
    chipId: 'N/A',
    type: 'Dog',
    breed: 'Defaul Breed',
    age: 'N/A'
  };

  const defaultMeds = [{
    medicationName: 'Default Name',
    dosage: '/placeholder.svg?height=128&width=128',
    frequency: 'N/A',
    medicationDate: 'Dog',
    vetName: 'Defaul Breed',
    dueDate: 'N/A',
    notes: 'N/A'
  }];

  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useContext(AuthContext);

  const [adoptionInfo, setAdoptionInfo] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    // Fetch pet data by ID
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`http://localhost:51007/pets/profile/${petId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { userId: auth.userId }, // Send userId if necessary
        });
        setPet(response.data); // Set fetched data to pet state
      } catch (error) {
        console.error("Error fetching pet data:", error);
        setPet({
          name: 'Default Name',
          image: '/placeholder.svg?height=128&width=128',
          chipId: 'N/A',
          type: 'Dog',
          breed: 'Defaul Breed',
          age: 'N/A'
        }); // Default if there's an error
      }
    };

    // Fetch Adoption Info by ID
    const fetchAdoptionInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:51007/pets/profile/${petId}/adoption`);
        setAdoptionInfo(response.data);
      } catch (error) {
        console.error("Error fetching adoption info:", error);
      }
    };

    // Fetch Vaccinations by ID
    const fetchVaccinations = async () => {
      try {
        const response = await axios.get(`http://localhost:51007/pets/profile/${petId}/vaccination`);
        setVaccinations(response.data);
      } catch (error) {
        console.error("Error fetching vaccinations:", error);
      }
    };

    // Fetch Medications by ID
    const fetchMedications = async () => {
      try {
        const response = await axios.get(`http://localhost:51007/pets/profile/${petId}/medication`);
        setMedications(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchPetData();
    fetchAdoptionInfo();
    fetchVaccinations();
    fetchMedications();
  }, [petId]);

  useEffect(() => {
    if (pet) {
      console.log("Contents of 'pet':", pet);
    }
    if (medications) {
      console.log("Contents of 'medications':", medications);
    }
  }, [pet], [medications]);

  // Use the provided pet data or fall back to default values
  const petData = pet || defaultPet;
  console.log("Contents of 'petData':", petData);

  // for debuggind
  // useEffect(() => {
  //   if (medications) {
  //     console.log("Contents of 'medications':", medications);
  //   }
  // }, [medications]);

  // Use the provided pet data or fall back to default values
  const medInfo = medications || defaultMeds;
  console.log("Contents of 'medInfo':", medInfo);

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:51007/share', {
        petId,
        targetEmail: shareEmail,
      });
      setShareStatus(`Profile shared successfully with ${shareEmail}!`);
      setShareEmail(''); // Clear the email input
      setIsModalOpen(false); // Close the modal after sharing
    } catch (error) {
      setShareStatus("Failed to share profile. Try again.");
      console.error(error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setShareStatus(''); // Reset any previous status
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShareEmail(''); // Clear the email input
  };

  if (!pet) return <p>Loading pet profile...</p>;

  // Function to update pet's weight data
  const updatePetWeight = (updatedWeightData) => {
    setPet((prevPet) => ({
      ...prevPet,
      weightData: updatedWeightData,
    }));
  };

  if (!pet) return <p>Loading pet profile...</p>; // Display a loading message

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />

      {/* Share Pet Profile */}
      <main className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button onClick={openModal} className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Share Pet Profile
          </button>

          {/* Share Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h3 className="text-xl font-bold mb-4">Share Pet Profile</h3>
                <form onSubmit={handleShare}>
                  <label className="block mb-2">
                    Enter the email of the user to share with:
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter user's email"
                      className="w-full px-2 py-1 border rounded mt-1"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
                  >
                    Cancel
                  </button>
                </form>
                {shareStatus && <p className="mt-2 text-green-500">{shareStatus}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Pet Profile Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 mb-4">
              <img
                src={petData.image}
                alt={petData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{petData.name}</h2>
            <p className="text-gray-600">
              Chip ID: {petData?.chipId || 'N/A'} | {(petData?.type).toUpperCase() || 'N/A'} | {petData?.breed || 'N/A'} | Age: {calculateAge(petData?.dateOfBirth) || 'N/A'} | DOB: {petData?.dateOfBirth || 'N/A'}
            </p>
          </div>

          {/* Tabs for Additional Info */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === 'medical'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
                onClick={() => setActiveTab('medical')}
              >
                Medical Records
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === 'nutrition'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
                onClick={() => setActiveTab('nutrition')}
              >
                Nutrition
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${
                  activeTab === 'services'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
            </div>
          </div>

          {/* Medical Records Tab */}
          {activeTab === 'medical' && (
            <div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Physician Information</h3>
                <p>Primary Physician: {adoptionInfo?.vetName || 'N/A'}</p>
                <p>Office: {adoptionInfo?.officeName || 'N/A'}</p>
                <p>Phone: {adoptionInfo?.phoneNumber || 'N/A'}</p>
                <p>First Visit: {adoptionInfo?.firstVisitDate || 'N/A'}</p>
                <p>Last Visit: {adoptionInfo?.lastVisitDate || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Adoption Information</h3>
                  <p>Adoption Date: July 15, 2015</p>
                  <p>Rescue Center: Paw Haven</p>
                  <p>Adoption Fee: $250</p>
                </div>
              </div>
              {/* Vaccines Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Vaccines</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Vaccine</th>
                      <th className="border p-2 text-left">Physician</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.map((vaccine) => (
                      <tr key={vaccine.vaccination_id}>
                        <td className="border p-2">{vaccine?.vaccinationDate || 'N/A'}</td>
                        <td className="border p-2">{vaccine?.vaccinationName || 'N/A'}</td>
                        <td className="border p-2">{vaccine?.vetName || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br></br>
              {/* Medications Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Medications</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Medicine</th>
                      <th className="border p-2 text-left">Dosage</th>
                      <th className="border p-2 text-left">Frequency</th>
                      <th className="border p-2 text-left">Prescribed On</th>
                      <th className="border p-2 text-left">Prescribed By</th>
                      <th className="border p-2 text-left">Due Date</th>
                      <th className="border p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medInfo.map((medicine) => (
                      <tr key={medicine.vaccination_id}>
                        <td className="border p-2">{medicine?.medicationName || 'N/A'}</td>
                        <td className="border p-2">{medicine?.dosage || 'N/A'}</td>
                        <td className="border p-2">{medicine?.frequency || 'N/A'}</td>
                        <td className="border p-2">{medicine?.medicationDate || 'N/A'}</td>
                        <td className="border p-2">{medicine?.vetName || 'N/A'}</td>
                        <td className="border p-2">{medicine?.dueDate || 'N/A'}</td>
                        <td className="border p-2">{medicine?.notes || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Nutrition Information</h3>
              <NutritionTab pet={pet} updatePetWeight={updatePetWeight}/>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Services</h3>
              <p>Information about pet services and appointments for {petData.name} will be shown here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PetProfile;