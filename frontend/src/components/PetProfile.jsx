import React, { useState } from 'react';
import Navbar from './Navbar';

const PetProfile = ({ pet }) => {
  const [activeTab, setActiveTab] = useState('medical');

  // Default values if pet data is missing
  const defaultPet = {
    name: 'Unknown Pet',
    image: '/placeholder.svg?height=128&width=128',
    chipId: 'N/A',
    type: 'Unknown',
    breed: 'Unknown',
    age: 'N/A'
  };

  // Use the provided pet data or fall back to default values
  const petData = pet || defaultPet;

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />

      <main className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Share Pet Profile
          </button>
        </div>

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
              Chip ID: {petData.chipId} | {petData.breed || petData.type} | Age: {petData.age}
            </p>
          </div>

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

          {activeTab === 'medical' && (
            <div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Physician Information</h3>
                  <p>Primary Physician: Dr. McRuffles</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: drmcruffles@pawmail.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Adoption Information</h3>
                  <p>Adoption Date: July 15, 2015</p>
                  <p>Rescue Center: Paw Haven</p>
                  <p>Adoption Fee: $250</p>
                </div>
              </div>
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
                    <tr>
                      <td className="border p-2">9/15/2023</td>
                      <td className="border p-2">Flu Shot</td>
                      <td className="border p-2">Dr. McRuffles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Nutrition Information</h3>
              <p>Nutrition details and diet plans for {petData.name} will be displayed here.</p>
            </div>
          )}

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