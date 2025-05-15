import React, { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import { useLazyGetClassesQuery} from '../../redux/api/classesApiSlice';
import { setCredientials } from '../../redux/features/services/courseSlice.js';
import { setDetails } from '../../redux/features/services/classIdSlice.js';

import { toast } from 'react-toastify'
const   ClassListLec = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

const {userInfo}=useSelector(state =>state.auth)
const [getAllclasses]=useLazyGetClassesQuery();



  
  useEffect(() => {
      if(!userInfo && !(userInfo.role == "admin")) {
          navigate('/login')
      }
  }, [navigate, userInfo]);

  

const [allItems, setAllItems] = useState([
  ]);

   useEffect(() => {
      getItems();
    }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);

  const getItems=async()=>{
    let responseObj=[];
    try {
      responseObj = await getAllclasses().unwrap();
     console.log(responseObj);
     setAllItems(responseObj.data);
     
 } catch (error) {
     toast.error(error?.data?.message || error.message)
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

  
  const handleClick = async(e) => {
    e.preventDefault()
    let uid=e.target.id;
    
            try {
                dispatch(setCredientials(allItems));
                dispatch(setDetails(uid));
                navigate(`/admin/previewlec`);
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
   
    
  }

  return (
    <div className=" mx-auto px-6  relative py-8 w-screen  my-0 ">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cards..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img 
              src={item.thumbnail.secure_url} 
              alt={item.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            </div>
            <div className="px-4 pb-4">
              <button className="w-full hover:bg-blue-400 text-white py-2 px-4 rounded transition-colors" id={item._id} onClick={handleClick} >
                View lectures
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

export default ClassListLec