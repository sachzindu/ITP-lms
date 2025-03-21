import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const ShowTicket = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/ticket/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
          Ticket Details
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {book.name || "Ticket Details"}
                </h2>
                <p className="text-gray-500">ID: {book._id}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {book.category || "Uncategorized"}
              </span>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Name" value={book.name} />
              <InfoItem label="Email" value={book.email} />
              <InfoItem label="Registration No." value={book.registrationNumber} />
              <InfoItem label="Grade" value={book.grade} />
              <InfoItem label="Contact Number" value={book.contactNumber} />
              <InfoItem label="Subject" value={book.subject} />
            </div>

            {/* Message Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
                {book.message || "No message provided"}
              </div>
            </div>

            {/* Attachment Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Attachment</h3>
              {book.attachment ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={`/images/${book.attachment}`}
                    alt="Attachment"
                    className="w-20 h-20 object-cover rounded-md"
                    onError={(e) => (e.target.src = '/images/default.jpg')}
                  />
                  <span className="text-gray-600">{book.attachment}</span>
                </div>
              ) : (
                <td className="py-4 px-4">
                {book.photo ? (
                  <img
                    src={`/images/${book.photo}`}
                    alt="Ticket file"
                    className="w-22 h-22 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <span className="text-gray-500">No file</span>
                )}
              </td>
              )}
            </div>

            {/* Status Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
                Ticket Status
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600">In Progress (40%)</p>
            </div>

            {/* Timestamps */}
            <div className="mt-6 pt-6 border-t flex justify-between text-sm text-gray-500">
              <span>Created: {new Date(book.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(book.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for information items
const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
    <span className="block text-sm font-medium text-gray-500">{label}</span>
    <span className="mt-1 block text-gray-800">
      {value || "Not provided"}
    </span>
  </div>
);

export default ShowTicket;