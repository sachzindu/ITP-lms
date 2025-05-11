import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetClassesQuery } from '../../redux/api/classesApiSlice';
import { setCredientials } from '../../redux/features/services/courseSlice';
import { setDetails } from '../../redux/features/services/classIdSlice';
import { toast } from 'react-toastify';
import { Search, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const AllClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [getAllClasses] = useLazyGetClassesQuery();

  // State management
  const [allItems, setAllItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 9; // 3 cards per row, 3 rows per page

  

  // Fetch all classes
  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter items based on search
  useEffect(() => {
    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allItems]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await getAllClasses().unwrap();
      setAllItems(response.data);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle class selection
  const handleClassSelect = (id) => {
    try {
      dispatch(setCredientials(allItems));
      dispatch(setDetails(id));
      navigate('/student/seeclassdetails');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // Handle create new class
  const handleCreateClass = () => {
    navigate('/admin/createclass');
  };

  // Display pagination buttons
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxButtonsToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = startPage + maxButtonsToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageButtons;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header with title and create button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Classes</h1>
       
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search classes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Empty state */}
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? "Try a different search term" : "Create your first class to get started"}
              </p>
            </div>
          ) : (
            <>
              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md"
                  >
                    <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                      <img 
                        src={item.thumbnail.secure_url} 
                        alt={item.title} 
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                    </div>
                    <div className="px-4 pb-4">
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                        onClick={() => handleClassSelect(item._id)}
                      >
                        Go to class
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {renderPaginationButtons()}
                  
                  <button 
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AllClasses;