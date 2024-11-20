import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../shared/context/auth-context';
import axios from 'axios';
import Navbar from './Navbar';
import { parseISO, format } from 'date-fns';
import dogPic from "./dogProfilePic.jpg";

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
)

const MoreVertical = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
)

const VetPortal = () => {
  const auth = useContext(AuthContext);
  const { userName, token } = auth;

  const [owners, setOwners] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [expandedOwners, setExpandedOwners] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [lastVisitData, setLastVisitData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('')

  // for 'todays visit'
  const [visitReason, setVisitReason] = useState('');
  const [visitWeight, setVisitWeight] = useState('');
  const [visitMedications, setVisitMedications] = useState([]);
  const [visitVaccinations, setVisitVaccinations] = useState([]);
  const [visitNotes, setVisitNotes] = useState('');

  useEffect(() => {
      const fetchOwners = async () => {
        try {
          const token = localStorage.getItem('token'); // Retrieve token from localStorage
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/owners`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          // console.log("Fetched Owners:", response.data);
          setOwners(response.data);
        } catch (error) {
            console.error('Error fetching owners:', error);
        }
      };

      fetchOwners();
  }, [token]);

  const fetchAppointments = async (petId) => {
    const token = localStorage.getItem('token');
    // console.log("Token for 'toggleOwner'", token);
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/appointments/get?petId=${petId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
  };

  const toggleOwner = async (ownerId) => {
    if (!expandedOwners.includes(ownerId)) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/owners`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log("Fetched Owners with Pets:", response.data);
  
        setOwners((prev) =>
          prev.map((owner) =>
            owner.owner_id === ownerId
              ? { ...owner, pets: response.data.find(o => o.owner_id === ownerId)?.pets || [] }
              : owner
          )
        );
        // console.log("Updated Owners with Pets:", owners);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    }
    setExpandedOwners((prev) =>
      prev.includes(ownerId) ? prev.filter((id) => id !== ownerId) : [...prev, ownerId]
    );
  };

  const selectPet = async (pet) => {
    // clear any input fields
    setVisitReason('');
    setVisitWeight('');
    setVisitMedications([]);
    setVisitVaccinations([]);
    setVisitNotes('');

    // console.log("Selected Pet:", pet);
    setSelectedPet(null);
    setSelectedPet(pet);
    // fetchAppointments(pet.id);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/appointments/last-visit`,
          {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                petId: pet.pet_id,
                vetName: userName
              },
          }
      );

      setLastVisitData(null); // Clear the data for the previously selected pet
      console.log("last appointment info:", response.data);
      setLastVisitData(response.data);
    } catch (error) {
        console.error('Error fetching last visit data:', error);
        setLastVisitData(null);
    }
  };

  const handleSubmitVisitData = async (e) => {
    e.preventDefault();

    const visitData = {
        vetName: userName,
        petId: selectedPet.pet_id,
        reason: visitReason,
        date: new Date().toISOString().split('T')[0],
        weight: visitWeight || null,
        vaccinations: visitVaccinations || [],
        medications: visitMedications || [],
        notes: visitNotes || null,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/appointments/update`, visitData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          console.log('Visit data updated successfully');
          // Clear form fields after successful submission
          setVisitReason('');
          setVisitWeight('');
          setVisitMedications([]);
          setVisitVaccinations([]);
          setVisitNotes('');
        }
    } catch (error) {
        console.error('Error updating visit data:', error);
        // alert('Failed to update visit data');
    }
  };

  const filteredOwners = owners.filter((owner) =>
    owner.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
    <Navbar name={userName} />
    <div className="flex h-screen bg-orange-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white flex flex-col">
        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Owner"
              className="w-full pl-8 pr-2 py-1 rounded bg-orange-600 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredOwners.map((owner) => (
            <div key={owner.owner_id}>
              <button
                onClick={() => toggleOwner(owner.owner_id)}
                className="w-full flex items-center px-4 py-2 hover:bg-orange-600 hover:text-white text-left text-orange-500"
              >
                {expandedOwners.includes(owner.owner_id) ? (
                  <ChevronDown className="mr-2" />
                ) : (
                  <ChevronRight className="mr-2" />
                )}
                {owner.owner_name}
              </button>
              {expandedOwners.includes(owner.owner_id) && (
                <div className="pl-8">
                  {owner.pets?.length > 0 ? (
                    owner.pets.map((pet) => {
                      // console.log("Rendering Pet:", pet);
                      return (
                        <button
                          key={pet.pet_id}
                          onClick={() => selectPet(pet)}
                          className={`w-full px-4 py-2 text-left hover:bg-orange-600 hover:text-white ${
                            owner.pets?.length > 0 ? 'bg-orange-900' : ''
                          } text-orange-300`}
                        >
                          {pet.pet_name}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No pets found.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedPet && (
          <div className="space-y-6">
            {/* Pet Header */}
            <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPet.image}
                  alt={selectedPet.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                  <p className="text-gray-600">
                    Chip ID: {selectedPet.chipId} | Age: {selectedPet.age} | Breed: {selectedPet.breed}
                  </p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Medical Files */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Medical Files</h3>
                <div className="space-y-2">
                  {['2022', '2023', '2024'].map(year => (
                    <a
                      key={year}
                      href="#"
                      className="block text-blue-600 hover:underline"
                    >
                      {year}-Medical-Summary.pdf
                    </a>
                  ))}
                  <a href="#" className="block text-blue-600 hover:underline">
                    Emergency-Visit-Summary.pdf
                  </a>
                  <button className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 flex items-center justify-center">
                    <UploadIcon />
                    Add Record
                  </button>
                </div>
              </div>

              {/* Today's Visit */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Today's Visit: {new Date().toLocaleDateString()}</h3>
                <form className="space-y-4" onSubmit={handleSubmitVisitData}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for visit</label>
                    <input
                        type="text"
                        value={visitReason}
                        onChange={(e) => setVisitReason(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Update weight</label>
                      <input
                          type="text"
                          value={visitWeight}
                          onChange={(e) => setVisitWeight(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Medications</label>
                      <input
                          type="text"
                          value={visitMedications}
                          onChange={(e) => setVisitMedications(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Vaccinations</label>
                      <input
                          type="text"
                          value={visitVaccinations}
                          onChange={(e) => setVisitVaccinations(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                          rows={4}
                          value={visitNotes}
                          onChange={(e) => setVisitNotes(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                      ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                      Submit
                  </button>
                </form>
              </div>
            </div>

            {/* Previous Visits */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {lastVisitData ? (
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Last Visit: {lastVisitData.appointment.date ? format(parseISO(lastVisitData.appointment.date), 'MM/dd/yyyy') : 'Invalid Date'}
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p><strong>Reason for Visit:</strong> {lastVisitData.appointment.reason}</p>
                            <p><strong>Reported Weight:</strong> {lastVisitData.weights.length > 0 ? lastVisitData.weights[0].weight + ' lbs' : 'N/A'}</p>
                            <p><strong>Prescribed Medications:</strong> {lastVisitData.medications.length > 0 ? lastVisitData.medications.map(med => med.medicationName).join(', ') : 'N/A'}</p>
                            <p><strong>Vaccinations:</strong> {lastVisitData.vaccinations.length > 0 ? lastVisitData.vaccinations.map(vac => vac.vaccinationName).join(', ') : 'N/A'}</p>
                        </div>
                        <div>
                            <p><strong>Notes:</strong></p>
                            <p className="text-gray-600">{lastVisitData.appointment.notes || 'No notes available.'}</p>
                        </div>
                    </div>
                </div>
              ) : (
                  <p className="text-gray-500">No last visit data available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default VetPortal