import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Plus } from 'lucide-react';
import { setCredentials, setAssignmentId } from '../../redux/features/services/assignmentSlice';
import { useLazyGetAssignmentsByClassIdQuery } from '../../redux/api/assignmentApiSlice';
import { toast } from 'react-toastify';

const AllAssignments = () => {
  const [allItems, setAllItems] = useState([]);
  const [getAssignments] = useLazyGetAssignmentsByClassIdQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classIdInfo } = useSelector(state => state.classId);
  
  useEffect(() => {
    getItems();
  }, [classIdInfo, getAssignments]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);

  const getItems = async () => {
    try {
      const response = await getAssignments(classIdInfo).unwrap();
      setAllItems(response.assignments);
      dispatch(setCredentials(response.assignments));
    } catch(e) {
      toast.error("Error fetching items!");
    }
  }
  
  const itemsPerPage = 9; // 3 cards per row, 3 rows per page

  useEffect(() => {
    // Filter items based on search term
    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allItems]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleClick = (e) => {
    let iid = e.target.id;
    dispatch(setAssignmentId(iid));
    navigate(`/instructor/assignmentdetails`);
  }

  const handleCreateAssignment = () => {
    navigate('/instructor/createassignment');
    // You can also dispatch any required actions here
    toast.info("Redirecting to create assignment...");
  }

  return (
    <div className="container mx-auto px-4 relative py-8 max-w-6xl">
      {/* Header with Search Bar and Create Button */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:ml-4">
          <button 
            onClick={handleCreateAssignment}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 flex items-center justify-center">
              <FileText className="w-16 h-16 text-blue-500" />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            </div>
            <div className="px-4 pb-4">
              <button 
                className="w-full hover:bg-blue-400 text-white py-2 px-4 rounded transition-colors bg-blue-600" 
                id={item._id} 
                onClick={handleClick}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button 
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Prev
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAssignments;