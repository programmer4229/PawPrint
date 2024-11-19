import React, { useState, useContext } from 'react'
import Navbar from './Navbar';
import { AuthContext } from '../shared/context/auth-context';
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
  const [owners] = useState([
    {
      id: 1,
      name: 'John Doe',
      pets: [
        { name: 'Diesel', chipId: '12345678', age: 8, breed: 'Goldendoodle', image: dogPic },
        { name: 'Daisy', chipId: '23456789', age: 5, breed: 'Labrador', image: '/placeholder.svg?height=100&width=100' },
        { name: 'Derek', chipId: '34567890', age: 3, breed: 'German Shepherd', image: '/placeholder.svg?height=100&width=100' },
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      pets: [
        { name: 'Lucy', chipId: '45678901', age: 4, breed: 'Siamese Cat', image: '/placeholder.svg?height=100&width=100' },
        { name: 'Zeus', chipId: '56789012', age: 6, breed: 'Maine Coon', image: '/placeholder.svg?height=100&width=100' },
        { name: 'Bella', chipId: '67890123', age: 2, breed: 'Persian Cat', image: '/placeholder.svg?height=100&width=100' },
      ]
    }
  ])

  const [expandedOwners, setExpandedOwners] = useState([1])
  const [selectedPet, setSelectedPet] = useState(owners[0].pets[0])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleOwner = (ownerId) => {
    setExpandedOwners(prev =>
      prev.includes(ownerId)
        ? prev.filter(id => id !== ownerId)
        : [...prev, ownerId]
    )
  }
  const auth = useContext(AuthContext);
  const { email, userId, userName } = auth;
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
          {owners.map(owner => (
            <div key={owner.id}>
              <button
                onClick={() => toggleOwner(owner.id)}
                className="w-full flex items-center px-4 py-2 hover:bg-orange-600 hover:text-white text-left text-orange-500"
              >
                {expandedOwners.includes(owner.id) ? (
                  <ChevronDown className="mr-2" />
                ) : (
                  <ChevronRight className="mr-2" />
                )}
                {owner.name}
              </button>
              {expandedOwners.includes(owner.id) && (
                <div className="pl-8">
                  {owner.pets.map(pet => (
                    <button
                      key={pet.chipId}
                      onClick={() => setSelectedPet(pet)}
                      className={`w-full px-4 py-2 text-left hover:bg-orange-600 hover:text-white ${
                        selectedPet.chipId === pet.chipId ? 'bg-orange-800' : ''
                      } text-orange-500`}
                    >
                      {pet.name}
                    </button>
                  ))}
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
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for visit</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update weight</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medications</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">Submit</button>
                </form>
              </div>
            </div>

            {/* Previous Visits */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Last Visit: 11/4/2023</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p><strong>Reason for Visit:</strong> Annual Checkup</p>
                  <p><strong>Reported Weight:</strong> 32 lbs</p>
                  <p><strong>Prescribed Medications:</strong> N/A</p>
                </div>
                <div>
                  <p><strong>Notes:</strong></p>
                  <p className="text-gray-600">
                    Diesel looks to be in great shape, no major health issues. 
                    Ran ringworm and heart disease screenings and both came up negative, 
                    keep feeding him twice a day as you were to avoid weight loss as he 
                    is in the ideal range for a dog his size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default VetPortal