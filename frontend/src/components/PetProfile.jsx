import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NutritionTab from './NutritionTab';
import ServicesTab from './ServicesTab';
import { AuthContext } from '../shared/context/auth-context';
import dogProfileImage from './dogProfilePic.jpg';
import catProfileImage from './catProfilePic.jpeg';
import { FaCamera } from 'react-icons/fa';


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
  const { userName } = useContext(AuthContext);
  // console.log("User's name from AuthContext:", userName);
  const [activeTab, setActiveTab] = useState('medical');

  // for GET requests
  const { userId } = useContext(AuthContext);
  const { petId } = useParams();

  // for pet info
  const [petData, setPetData] = useState(null);
  const [adoptionInfo, setAdoptionInfo] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [weightData, setWeightData] = useState([]);

  // for pet image
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // for pet sharing
  const [shareEmail, setShareEmail] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // for read-only access to shared pet profiles
  const [isOwner, setIsOwner] = useState(false);

  // for deleting pet
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Fetch pet data by ID
  const fetchPetData = async () => {
    const token = localStorage.getItem('token');
    // console.log("Retrieved token from localStorage:", token);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'userId': userId,
        }
      });
      setPetData(response.data);
      // console.log("Fetched pet data:", response.data);
      setIsOwner(response.data.isOwner);
      // console.log("User owns this pet:", response.data.isOwner);
    } catch (error) {
      console.error("Error fetching pet data:", error);
    }
  };

  // Fetch Adoption Info by ID
  const fetchAdoptionInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petId}/adoption`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'userId': userId,
        }
      });
      setAdoptionInfo(response.data);
      // console.log("Fetched adoption info:", response.data);
    } catch (error) {
      console.error("Error fetching adoption info:", error);
    }
  };

  // Fetch Vaccinations by ID
  const fetchVaccinations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petId}/vaccination`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'userId': userId,
        }
      });
      setVaccinations(response.data);
      // console.log("Fetched vaccinations:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("No vaccinations found for this pet");
        setVaccinations([]);
      } else {
        console.error("Error fetching vaccinations:", error);
      }
    }
  };

  // Fetch Medications by ID
  const fetchMedications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petId}/medication`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'userId': userId,
        }
      });
      setMedications(response.data);
      // console.log("Fetched medications:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("No medications found for this pet");
        setMedications([]);
      } else {
        console.error("Error fetching medications:", error);
      }
    }
  };

  const fetchWeights = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petId}/weights`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setWeightData(response.data);
        console.log("Fetched weights:", response.data);
    } catch (error) {
        console.error("Error fetching weights:", error);
    }
  };

  useEffect(() => {
    fetchPetData();
    fetchAdoptionInfo();
    fetchVaccinations();
    fetchMedications();
    fetchWeights();
  }, [petId]);

  // delete pet
  const handleDeletePet = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/pets/profile/${petData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // alert('Pet deleted successfully.');
      navigate('/petselection'); // Navigate back to the pet selection page
    } catch (error) {
      console.error('Error deleting pet:', error);
      // alert('Failed to delete the pet. Please try again.');
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload (for pet's profile pic)
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/pets/${petId}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update petData with the new image URL to display immediately
      setPetData({ ...petData, image: response.data.imagePath }); // Update pet image
      setSelectedFile(null);
      setIsUploadModalOpen(false);  // Close modal after uploading
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null); // Clear the selected file when closing
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // console.log("petId:", petId);
      // console.log("target email:", shareEmail);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pets/share`,
        {
        petId,
        targetEmail: shareEmail,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'userId': userId,
          },
        }  
      );
      setShareStatus(`Profile shared successfully with ${shareEmail}!`);
      setShareEmail(''); // Clear the email input
      setIsModalOpen(false); // Close the modal after sharing
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);  // hide toast after 5 seconds
    } catch (error) {
      setShareStatus("Failed to share profile. Try again.");
      console.error("Error sharing pet profile:", error);
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

  // Function to update pet services
  const updateServices = (updatedServices) => {
    setPetData((prevPet) => ({
      ...prevPet,
      services: updatedServices,
    }));
  };

  if (!petData) return <p>Loading pet profile...</p>;

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar name={userName} />
    
    {/* Toast Notification */}
    {showToast && (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
        Pet profile shared successfully!
      </div>
    )}

    {/* Main Content */}
    {/* Share Pet Profile */}
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      {/* Delete Button (Visible only to owner) */}
      {isOwner && (
        <button
          onClick={handleOpenDeleteModal}
          className="bg-red-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-red-600 transition-colors"
        >
          Delete Pet
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete the profile of {petData.name}?</p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseDeleteModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeletePet();
                  handleCloseDeleteModal();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

        {isOwner && (
          <button onClick={openModal} className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Share Pet Profile
          </button>
        )}

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
          {/* Profile picture display */}
          <div className={`relative w-32 h-32 rounded-full overflow-hidden mb-4 group cursor-pointer 
            ${isOwner ? 'border-orange-500' : 'border-purple-500'} border-4`}
            // only owner can upload a profile pic for this pet
          onClick={isOwner ? openUploadModal : undefined}
          >
            <img
              src={
                petData.image 
                    ? `data:image/jpeg;base64,${petData.image}`
                    : petData.type.toLowerCase() === 'dog'
                        ? dogProfileImage
                        : catProfileImage
              }
              alt={petData.name}
              className="w-full h-full object-cover"
            />
            {/* Only allow owner to upload a new profile picture */}
            {isOwner && (
              <div
                className="absolute bottom-3 right-3 bg-white p-1 rounded-full shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                // onClick={openUploadModal}
              >
                <FaCamera className="text-orange-500" />
              </div>
            )}
          </div>

          {/* Pet general info display */}
          <h2 className="text-2xl font-bold">{petData.name}</h2>
          <p className="text-gray-600">
            Chip ID: {petData?.chipId || 'N/A'} | {(petData?.type).toUpperCase() || 'Unknown'} | {(petData?.breed).toUpperCase() || 'Unknown'} | Age: {calculateAge(petData?.dateOfBirth) || 'Unknown'} | DOB: {petData?.dateOfBirth ? new Date(petData.dateOfBirth).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Unknown'}
          </p>
        </div>

        {/* Image Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h3 className="text-xl font-bold mb-4">Update Profile Picture</h3>
              <input type="file" onChange={handleFileChange} className="mb-4" />
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full">Upload</button>
              <button onClick={closeUploadModal} className="bg-red-500 text-white px-4 py-2 rounded w-full">Cancel</button>
            </div>
          </div>
        )}

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
              {vaccinations.length > 0 ? (
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
              ) : (
                <p className="text-gray-500">No vaccination records found for this pet.</p>
              )}
            </div>
            <br></br>
            {/* Medications Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Medications</h3>
              {medications.length > 0 ? (
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
                    {medications.map((medicine) => (
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
              ) : (
                <p className="text-gray-500">No medications found for this pet.</p>
              )}
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Nutrition Information</h3>
            <NutritionTab pet={{petData, weightData}} isOwner={isOwner} refreshWeights={fetchWeights} />
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <ServicesTab pet={petData} updateServices={updateServices}/>
          </div>
        )}
      </div>
    </main>
    </div>
  );
};

export default PetProfile;