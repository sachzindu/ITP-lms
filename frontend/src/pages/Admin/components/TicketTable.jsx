import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";

const TicketTable = ({ books }) => {
  const [query, setQuery] = useState("");
  const keys = ["name", "grade", "subject", "category"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">IgniteLearn Support Tickets</h2>
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Reg No</th>
                <th className="py-3 px-4 text-left">Grade</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Uploaded Photo</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {search(books).map((book, index) => (
                <tr 
                  key={book._id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-800">{book.name}</span>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-gray-600">
                    {book.email}
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-gray-600">
                    {book.registrationNumber}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {book.grade}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{book.contactNumber}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{book.subject}</td>
                  <td className="py-4 px-4">
                        {book.photo ? (
                          <img
                            src={book.photo.secure_url}
                            alt="Ticket file"
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-500">No file</span>
                        )}
                      </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/ticket/details/${book._id}`} className="group">
                        <BsInfoCircle className="text-xl text-green-600 group-hover:text-green-800 transition-colors" />
                      </Link>
                      <Link to={`/admin/editticket/${book._id}`} className="group">
                        <AiOutlineEdit className="text-xl text-yellow-600 group-hover:text-yellow-800 transition-colors" />
                      </Link>
                      <Link to={`/admin/deleteticket/${book._id}`} className="group">
                        <MdOutlineDelete className="text-xl text-red-600 group-hover:text-red-800 transition-colors" />
                      </Link>
                      <PDFDownloadLink
                        document={<TicketPDF book={book} />}
                        fileName={`${book.name}_ticket.pdf`}
                        className="ml-2"
                      >
                        {({ loading }) => (
                          <button
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                              loading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            disabled={loading}
                          >
                            {loading ? "Generating..." : "PDF"}
                          </button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {search(books).length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No tickets found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TicketTable;