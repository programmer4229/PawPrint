import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NutritionTab = ({ pet, updatePetWeight }) => {
  const [newWeight, setNewWeight] = useState('');

  const handleAddWeight = () => {
    if (newWeight && !isNaN(newWeight)) {
      const today = new Date().toISOString().split('T')[0];
      const updatedWeightData = [
        ...pet.weightData,
        { date: today, weight: parseFloat(newWeight) }
      ];
      updatePetWeight(updatedWeightData);
      setNewWeight('');
    }
  };
  console.log(pet);
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Weight Tracker</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pet.weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Enter weight"
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddWeight}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Add Weight
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionTab;