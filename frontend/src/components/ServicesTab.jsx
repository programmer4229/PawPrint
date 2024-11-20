import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../shared/context/auth-context';

const ServicesTab = ({ pet = { id: '' } }) => {
  const [date, setDate] = useState('');
  const [reason, setService] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [pastVisits, setPastVisits] = useState([]);


  const auth = useContext(AuthContext);
  // Fetch appointments and past visits
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/appointments/get`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          },
          params: { petId: pet.id },
        });
        setAppointments(response.data.upcoming || []);
        setPastVisits(response.data.past || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    if (pet.id) fetchAppointments();
  }, [pet.id]);

  // Create new appointment
  const createAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointments/create/`,
        {
          careTaker: auth.userId,
          petId: pet.id,
          date,
          reason,
          frequency,
          time,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Update the state with the new appointment
      console.log('New appointment:', response.data);
      setAppointments((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  // Delete an appointment
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/appointments/delete`, {
        params: { id }
      });
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div>
      <div className="right-side-div" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <form className="mt-4 mb-6 flex space-x-2" onSubmit={createAppointment}>
          <input
            type="date"
            placeholder="07/10/23"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            required
          />
          <input
            type="time"
            placeholder="10:00 AM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            required
          />
          <select
            value={reason}
            onChange={(e) => setService(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            required
          >
            <option value="">Select Service</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="Groomer">Groomer</option>
            <option value="Trainer">Trainer</option>
          </select>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biMonthly">Bi-Monthly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            type="submit"
          >
            + Add Reminder
          </button>
        </form>
      </div>

      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left">Date</th>
          <th className="border px-4 py-2 text-left">Reason</th>
          <th className="border px-4 py-2 text-left">Time</th>
          <th className="border px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment, index) => (
          <tr key={appointment.id || index} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{appointment.date}</td>
            <td className="border px-4 py-2">{appointment.reason}</td>
            <td className="border px-4 py-2">{appointment.time}</td>
            <td className="border px-4 py-2">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                onClick={() => deleteAppointment(appointment.id)}
              >
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
            {pastVisits.map((visit) => (
              <tr key={visit.id}>
                <td className="border p-2">{visit.date}</td>
                <td className="border p-2">{visit.reason}</td>
                <td className="border p-2">{visit.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTab;
