import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../shared/context/auth-context';
import axios from 'axios';
import Navbar from './Navbar';
import { parseISO, format } from 'date-fns';
import dogPic from "./dogProfilePic.jpg";
import catPic from './catProfilePic.jpeg';


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
  const [visitMedications, setVisitMedications] = useState([
    { name: '', dosage: '', frequency: '', notes: '', dueDate: '' },
  ]);
  const [visitVaccinations, setVisitVaccinations] = useState([
      { name: '', dueDate: '' },
  ]);

  const [visitNotes, setVisitNotes] = useState('');

  // for active tab
  const [activeTab, setActiveTab] = useState('lastVisit');
  const handleTabSwitch = (tab) => setActiveTab(tab);

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

  const fetchPrevAppointments = async (petId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/appointments/previous-visits`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                petId: petId,
                vetName: userName,
            },
        });

        // console.log('Fetched previous appointments with details:', response.data);
        setAppointments(response.data);
    } catch (error) {
        console.error('Error fetching previous appointments:', error);
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

    // Clear input fields after successful form submission or pet selection
    const clearVisitFields = () => {
      setVisitReason('');
      setVisitWeight('');
      setVisitMedications([]);
      setVisitVaccinations([]);
      setVisitNotes('');
  };

  const selectPet = async (pet) => {
    // clear any input fields
    clearVisitFields();

    // console.log("Selected Pet:", pet);
    setSelectedPet(null);
    setSelectedPet(pet);

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
      // console.log("last appointment info:", response.data);
      setLastVisitData(response.data);

      // Fetch all previous appointments
      await fetchPrevAppointments(pet.pet_id);
    } catch (error) {
        console.error('Error fetching last visit data:', error);
        setLastVisitData(null);
    }
  };

  // Update Medications
  const handleMedicationChange = (index, field, value) => {
    setVisitMedications((prev) =>
        prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  // Update Vaccinations
  const handleVaccinationChange = (index, field, value) => {
    setVisitVaccinations((prev) =>
        prev.map((vac, i) => (i === index ? { ...vac, [field]: value } : vac))
    );
  };

  const addMedication = () => {
    setVisitMedications((prev) => [...prev, { name: '', dosage: '', frequency: '', notes: '', dueDate: '' }]);
  };

  const addVaccination = () => {
    setVisitVaccinations((prev) => [...prev, { name: '', dueDate: '' }]);
  };

  const removeMedication = (index) => {
    setVisitMedications((prevMeds) => prevMeds.filter((_, i) => i !== index));
  };

  const removeVaccination = (index) => {
    setVisitVaccinations((prevVaccinations) => prevVaccinations.filter((_, i) => i !== index));
  };

  const handleSubmitVisitData = async (e) => {
    e.preventDefault();

    const visitData = {
        vetName: userName,
        petId: selectedPet.pet_id,
        reason: visitReason,
        date: new Date().toISOString().split('T')[0],
        weight: visitWeight || null,
        vaccinations: visitVaccinations.map((vac) => ({
            name: vac.name,
            dueDate: vac.dueDate || null,
        })),
        medications: visitMedications.map((med) => ({
            name: med.name,
            dosage: med.dosage || null,
            frequency: med.frequency || null,
            notes: med.notes || null,
            dueDate: med.dueDate || null,
        })),
        notes: visitNotes || null,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/appointments/update`,
            visitData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log('Visit data updated successfully');
        // Clear form fields after successful submission
        clearVisitFields();
    } catch (error) {
        console.error('Error updating visit data:', error);
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
                  src={selectedPet.pet_image || (selectedPet.pet_type.toLowerCase() === 'dog' ? dogPic : catPic)}
                  alt={selectedPet?.pet_name || 'Pet Profile'}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedPet.pet_name}</h2>
                  <p className="text-gray-600">
                    Chip ID: {selectedPet?.chipId || 'N/A'} | 
                    Type: {(selectedPet?.pet_type).toUpperCase() || 'Unknown'} |
                    Breed: {selectedPet?.pet_breed || 'Unknown'} | 
                    Age: {calculateAge(selectedPet?.pet_dob) || 'Unknown'} | 
                    DOB: {selectedPet?.pet_dob ? new Date(selectedPet.pet_dob).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Unknown'}
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
                    <label className="block text-medium font-semibold text-gray-700">Reason for visit</label>
                    <input
                        type="text"
                        value={visitReason}
                        onChange={(e) => setVisitReason(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                      <label className="block text-medium font-semibold text-gray-700">Update weight</label>
                      <input
                          type="text"
                          value={visitWeight}
                          onChange={(e) => setVisitWeight(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                      />
                  </div>
                  <div>
                    <label className="block text-medium font-semibold text-gray-700">Medications</label>
                      {visitMedications.map((med, index) => (
                          <div key={index} className="space-y-2 border-b pb-4 mb-4">
                              <input
                                  type="text"
                                  value={med.name}
                                  placeholder="Medication Name"
                                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500"
                              />
                              <input
                                  type="text"
                                  value={med.dosage}
                                  placeholder="Dosage"
                                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500"
                              />
                              <input
                                  type="text"
                                  value={med.frequency}
                                  placeholder="Frequency"
                                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500"
                              />
                              <textarea
                                  value={med.notes}
                                  placeholder="Notes"
                                  onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500"
                              />
                              <div className="relative">
                                  <input
                                      type="date"
                                      value={med.dueDate}
                                      onChange={(e) => handleMedicationChange(index, 'dueDate', e.target.value)}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 pl-20"
                                  />
                                  {!med.dueDate && (
                                      <span className="absolute top-1/2 left-0 text-gray-400 transform -translate-y-1/2 pointer-events-none">
                                          Next Dose
                                      </span>
                                  )}
                              </div>
                              <button
                                  type="button"
                                  onClick={() => removeMedication(index)} // Add remove functionality
                                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                              >
                                  Remove Medication
                              </button>
                          </div>
                      ))}
                      <button
                          type="button"
                          onClick={addMedication}
                          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                      >
                          Add Medication
                      </button>
                  </div>

                  <div>
                      <label className="block text-medium font-semibold text-gray-700">Vaccinations</label>
                      {visitVaccinations.map((vac, index) => (
                          <div key={index} className="space-y-2 border-b pb-4 mb-4">
                              <input
                                  type="text"
                                  value={vac.name}
                                  placeholder="Vaccination Name"
                                  onChange={(e) => handleVaccinationChange(index, 'name', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500"
                              />
                              <div className="relative">
                                  <input
                                      type="date"
                                      value={vac.dueDate}
                                      onChange={(e) => handleVaccinationChange(index, 'dueDate', e.target.value)}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 pl-20" /* Add padding to the left */
                                  />
                                  {!vac.dueDate && (
                                      <span className="absolute top-1/2 left-0 text-gray-400 transform -translate-y-1/2 pointer-events-none">
                                          Next Dose
                                      </span>
                                  )}
                              </div>
                              <button
                                  type="button"
                                  onClick={() => removeVaccination(index)} // Add remove functionality
                                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                              >
                                  Remove Vaccination
                              </button>
                          </div>
                      ))}
                      <button
                          type="button"
                          onClick={addVaccination}
                          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                      >
                          Add Vaccination
                      </button>
                  </div>
                  <div>
                      <label className="block text-medium font-medium text-gray-700">Notes</label>
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

            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-start space-x-4 border-b border-gray-200">
                  <button
                    className={`py-2 px-4 font-semibold ${
                      activeTab === 'lastVisit' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                    }`}
                    onClick={() => handleTabSwitch('lastVisit')}
                  >
                    Last Visit
                  </button>
                  <button
                    className={`py-2 px-4 font-semibold ${
                      activeTab === 'previousVisits' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-600'
                    }`}
                    onClick={() => handleTabSwitch('previousVisits')}
                  >
                    Previous Visits
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'lastVisit' && (
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
              )}

              {activeTab === 'previousVisits' && (
                  <div className="bg-white rounded-lg p-6 shadow-sm max-h-96 overflow-y-scroll">
                      <h3 className="text-xl font-semibold mb-4">Previous Visits</h3>
                      {appointments.length > 0 ? (
                          appointments.map((appointment) => (
                              <div key={appointment.id} className="mb-4 p-4 bg-gray-50 rounded shadow-sm">
                                  <p><strong>Date:</strong> {appointment.date}</p>
                                  <p><strong>Time:</strong> {appointment.time}</p>
                                  <p><strong>Reason:</strong> {appointment.reason}</p>
                                  <p><strong>Weight:</strong> {appointment.weights.length > 0 ? `${appointment.weights[0].weight} lbs` : 'N/A'}</p>
                                  <p><strong>Medications:</strong> {appointment.medications.length > 0 ? appointment.medications.map(med => med.medicationName).join(', ') : 'N/A'}</p>
                                  <p><strong>Vaccinations:</strong> {appointment.vaccinations.length > 0 ? appointment.vaccinations.map(vac => vac.vaccinationName).join(', ') : 'N/A'}</p>
                                  <p><strong>Notes:</strong> {appointment.notes || 'No notes available.'}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500">No previous visits found.</p>
                      )}
                  </div>
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