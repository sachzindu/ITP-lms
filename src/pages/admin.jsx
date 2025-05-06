/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import BooksTable from "../components/home/TicketTable";
import BooksCard from "../components/home/TicketCard";
import BackButton from "../components/BackButton";
import { useSnackbar } from 'notistack';

const Admin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'assigned', label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/ticket');
      setTickets(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error fetching tickets');
      console.error('Error:', err);
      enqueueSnackbar('Error fetching tickets', { variant: 'error' });
    }
    setLoading(false);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      console.log('Updating status:', { ticketId, newStatus });
      
      const response = await axios.put(`http://localhost:5000/ticket/${ticketId}/status`, {
        status: newStatus
      });
      
      console.log('Status update response:', response.data);

      if (response.data.success) {
        // Update the ticket in the local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket._id === ticketId
              ? { ...ticket, status: newStatus }
              : ticket
          )
        );
        enqueueSnackbar('Status updated successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update status',
        { variant: 'error' }
      );
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  console.log(books.length);
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton />
          <div className="flex justify-between items-center mt-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            
              
            </div>
          </div>
          
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900">
              Total Tickets: {tickets.length}
            </h2>
            <div className="mt-2 flex gap-4">
              {statusOptions.map(status => {
                const count = tickets.filter(ticket => ticket.status === status.value).length;
                return (
                  <div key={status.value} className={`px-4 py-2 rounded-lg ${getStatusColor(status.value)}`}>
                    {status.label}: {count}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{ticket.name}</span>
                        <span className="text-sm text-gray-500">ID: {ticket._id}</span>
                        <span className="text-sm text-gray-500">Grade: {ticket.grade}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{ticket.email}</span>
                        <span className="text-sm text-gray-500">{ticket.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.status || 'submitted'}
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                        className={`px-3 py-1 rounded-lg ${getStatusColor(ticket.status)}`}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/ticket/details/${ticket._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/ticket/timeline/${ticket._id}`}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Timeline
                        </Link>
                        <button
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        
                      </div>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
  );
  
};

export default Admin;
