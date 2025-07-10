/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { useLazyGetTicketDetailsQuery, useLazyGetTicketsQuery } from "../../redux/api/supportApiSlice";

const TicketHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [getTickets]=useLazyGetTicketsQuery();
  const keys = ["name", "grade", "subject", "category"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  useEffect(() => {
    setLoading(true);
    const getTicketsNow=async ()=>{
      try{
        const result=await getTickets().unwrap();
        if(result){
          console.log(result);
          setBooks(result.data);
          setLoading(false);

        }

      }catch(error){
        console.log(error);

      }
    }
    getTicketsNow();
   
  }, [getTickets]);

  return (
    <div className="min-h-screen bg-gray-50">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* For Admin Button Below Navbar */}
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Link to="/ticket/admin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            For Admin
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-[url(D:\Downloads3\UserManagement\UserManagement\frontend\src\assets\blurimage.avif)] bg-cover bg-center h-64 w-full bg-gradient-to- bg-[#1e81b0] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-black text-4xl font-bold mb-4">
            Welcome to IgniteLearn Support
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto mb-6">
            We're here to make your learning journey amazing! Get help with any
            issues, explore resources, and reach out to our friendly support
            team.
          </p>
          <Link to="/ticket/create">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors">
              Create New Ticket
            </button>
          </Link>
        </div>
      </section>
      <div className="absolute top-4 right-4">
        <Link to="/ticket/admin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            For Admin
          </button>
        </Link>
      </div>

      {/* Category Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Educational Issues",
              img: "https://soeonline.american.edu/wp-content/uploads/sites/2/2022/08/blog-education-policy-960x640-1.jpg",
              desc: "Help with learning content",
            },
            {
              title: "Technical Issues",
              img: "https://www.logicalposition.com/wp-content/uploads/2022/03/Common-Technical-Issues-banner.jpg",
              desc: "Solve platform problems",
            },
            {
              title: "Payment Issues",
              img: "https://inai.io/hubfs/Header%20-%20Online%20payment%20failure%20reasons%20and%20how%20to%20avoid%20it_%20%281%29.png",
              desc: "Billing support",
            },
          ].map((category) => (
            <div
              key={category.title}
              className="card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={category.img}
                alt={category.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.desc}</p>
                <Link
                  to="/ticket/create"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create Ticket →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tickets Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Tickets
            </h2>
            <input
              type="text"
              placeholder="Search tickets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {loading ? (
            <div className="text-center py-10">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1e81b0] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">
                      Reg No
                    </th>
                    <th className="py-3 px-4 text-left">Grade</th>
                    <th className="py-3 px-4 text-left">Contact</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Photo</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {search(books).map((book, index) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">{index + 1}</td>
                      <td className="py-4 px-4 font-medium">{book.name}</td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        {book.email}
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        {book.registrationNumber}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {book.grade}
                        </span>
                      </td>
                      <td className="py-4 px-4">{book.contactNumber}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">{book.subject}</td>
                      <td className="py-4 px-4">
                        {book.photo ? (
                          <img
                            src={`/images/${book.photo}`}
                            alt="Ticket file"
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-500">No file</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-3">
                         
                          <Link to={`/student/ticketdetails/${book._id}`}>
                            <BsInfoCircle className="text-xl text-green-600 hover:text-green-800" />
                          </Link>
                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {search(books).length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No tickets found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TicketHome;
