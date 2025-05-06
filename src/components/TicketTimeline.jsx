import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from './BackButton';
import Spinner from './Spinner';

const TicketTimeline = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/ticket/${id}`)
      .then((response) => {
        setTicket(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const timelineSteps = [
    { status: 'submitted', label: 'Submitted', color: 'blue' },
    { status: 'assigned', label: 'Assigned', color: 'yellow' },
    { status: 'in_progress', label: 'In Progress', color: 'orange' },
    { status: 'resolved', label: 'Resolved', color: 'green' },
  ];

  const getCurrentStepIndex = () => {
    if (!ticket) return 0;
    const currentStatus = ticket.status || 'submitted';
    return timelineSteps.findIndex(step => step.status === currentStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
          Ticket Timeline
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : ticket ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Ticket Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {ticket.subject}
              </h2>
              <p className="text-gray-600">Ticket ID: {ticket._id}</p>
              <p className="text-gray-600">Created by: {ticket.name}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

              {/* Timeline Steps */}
              <div className="relative space-y-8">
                {timelineSteps.map((step, index) => {
                  const currentStep = getCurrentStepIndex();
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={step.status}
                      className={`flex items-center ${
                        index % 2 === 0 ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Content */}
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <h3 className={`font-medium ${
                          isCompleted ? `text-${step.color}-600` : 'text-gray-400'
                        }`}>
                          {step.label}
                        </h3>
                        {isCurrent && ticket.lastUpdated && (
                          <p className="text-sm text-gray-500">
                            {new Date(ticket.lastUpdated).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Circle */}
                      <div className="relative flex items-center justify-center w-2/12">
                        <div
                          className={`w-8 h-8 rounded-full border-4 ${
                            isCompleted
                              ? `bg-${step.color}-500 border-${step.color}-200`
                              : 'bg-gray-200 border-gray-100'
                          } transform transition-all duration-500 ease-in-out`}
                        />
                      </div>

                      {/* Empty space for alignment */}
                      <div className="w-5/12" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Update Section (for admin) */}
            {ticket.isAdmin && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Update Status
                </h3>
                <div className="flex gap-2">
                  {timelineSteps.map((step) => (
                    <button
                      key={step.status}
                      onClick={() => handleStatusUpdate(step.status)}
                      className={`px-4 py-2 rounded-lg text-white bg-${step.color}-500 hover:bg-${step.color}-600 transition-colors`}
                      disabled={ticket.status === step.status}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Ticket not found
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketTimeline; 