import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const ServicesTab = ({ pet, updateServices }) => {
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [frequency, setFrequency] = useState('');
  const handleReminder = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className='right-side-div' style={{display:"flex", justifyContent:"flex-end"}}>
        <form className="mt-4 mb-6 flex space-x-2" onSubmit={handleReminder}>
          <input
            type="date"
            placeholder='07/10/23'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            required
          />
          <select
            type="service"
            placeholder='Select Service'
            value={service}
            onChange={(e) => setService(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            required
          >
            <option value="">Select Service</option>
            <option value="vet">Vet Appointment</option>
            <option value="groom">Grooming</option>
            <option value="train">Training</option>
          </select>
          <select
            type="frequency"
            placeholder='Select Frequency'
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
          >
            <option value="">Select Frequency</option>
            <option value="once">One Time</option>
            <option value="week">Weekly</option>
            <option value="biMonth">Bi-Monthly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            + Add Reminder
          </button>
        </form>
      </div>
      <h3 className="text-lg font-semibold mb-2">Upcoming Appointment</h3>
      <div className="mt-4 flex justify-center space-x-2 mb-6">
        <div style={{width:"500px"}}
        className="text-lg px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          <span>07/18/24 - Grooming</span>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          X
        </button>
      </div>
      <div className="mt-4 flex justify-center space-x-2 mb-6">
        <div style={{width:"500px"}}
        className="text-lg px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          <span>07/25/24 - Vet Appointment</span>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          X
        </button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Past Vet Visits</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Reason</th>
              <th className="border p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">10/20/2023</td>
              <td className="border p-2">Check Up</td>
              <td className="border p-2">Needs more exercise</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ServicesTab;