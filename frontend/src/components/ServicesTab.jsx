import React, { useState } from 'react';
import axios from 'axios';

const ServicesTab = ({ pet = { id: '' } }) => {
  const [date, setDate] = useState('');
  const [reason, setService] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');
 

  
  let data;
  const createAppointment = async (e) => {
    e.preventDefault();
    console.log('Creating appointment');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/appointments/create/`, {
        petId: pet.id,
        date,
        reason,
        frequency,
        time,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data);
    }
    catch (error) {
      console.log('Failed to create appointment:', error);
    }
  };
  return (
    <div>
      <div className='right-side-div' style={{display:"flex", justifyContent:"flex-end"}}>
        <form className="mt-4 mb-6 flex space-x-2" onSubmit={createAppointment}>
          <input
            type="date"
            placeholder='07/10/23'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            required
          />
          <input
            type="time"
            placeholder='10:00 AM'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            required
          />
          <select
            value={reason}
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
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className='px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
          >
            <option value="week">Weekly</option>
            <option value="biMonth">Bi-Monthly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            type="submit"
          >
            + Add Reminder
          </button>
        </form>
      </div>
      <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
      <div className="mt-4 flex justify-center space-x-2 mb-6">
        <div style={{width:"500px"}}
        className="text-lg px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          {/* input the date and service from the response data */}

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