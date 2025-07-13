/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./components/Spinner";
import { Link } from "react-router-dom";
import BackButton from "./components/BackButton"
import { useSnackbar } from 'notistack';
import { useLazyGetTicketsQuery } from "../../redux/api/supportApiSlice";

const SupportAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState("table");
  const { enqueueSnackbar } = useSnackbar();
  const [getTickets]=useLazyGetTicketsQuery();

  const statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'assigned', label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    fetchTickets();
  }, [getTickets]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets().unwrap();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      enqueueSnackbar('Error fetching tickets', { variant: 'error' });
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      console.log('Sending status update request:', {
        ticketId,
        newStatus,
        url: `http://localhost:5000/ticket/${ticketId}/status`
      });

      const response = await axios({
        method: 'PUT',
        url: `http://localhost:5000/ticket/${ticketId}/status`,
        data: { status: newStatus },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from server:', response.data);

      if (response.data.success) {
        // Update the local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket._id === ticketId
              ? { ...ticket, status: newStatus }
              : ticket
          )
        );
        enqueueSnackbar('Status updated successfully', { variant: 'success' });
      } else {
        // Handle unsuccessful response
        console.error('Update not successful:', response.data);
        enqueueSnackbar(response.data.message || 'Update failed', { variant: 'error' });
      }
    } catch (error) {
      // Detailed error logging
      console.error('Error updating status:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Show appropriate error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        enqueueSnackbar(error.response.data.message || 'Server error', { variant: 'error' });
      } else if (error.request) {
        // The request was made but no response was received
        enqueueSnackbar('No response from server', { variant: 'error' });
      } else {
        // Something happened in setting up the request that triggered an Error
        enqueueSnackbar('Error setting up request', { variant: 'error' });
      }
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
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
                          onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            statusOptions.find(opt => opt.value === ticket.status)?.color || 'bg-gray-100'
                          }`}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/ticket/${ticket._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/timeline/${ticket._id}`}
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
        )}
      </div>
  );
};

export default SupportAdmin;
