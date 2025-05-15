import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useLazyGetClassesByTeacherIdQuery } from '../../redux/api/classesApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setDetails } from '../../redux/features/services/classIdSlice';
import { useNavigate } from 'react-router';

const ClassListOfTeachers = () => {
  const [items, setAllItems] = useState([]);
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [getClassesByTeacherId] = useLazyGetClassesByTeacherIdQuery();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const getItems = async () => {
    setIsLoading(true);
    try {
      const responseObj = await getClassesByTeacherId(userInfo._id).unwrap();
      setAllItems(responseObj.classes);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(items.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = items.slice(startIndex, startIndex + cardsPerPage);

  const handleClick = (id) => {
    try {
      dispatch(setDetails(id));
      navigate(`/instructor/allassignments`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title with accent line */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center mb-2">
          <BookOpen className="text-indigo-600 mr-2" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Your Classes</h1>
        </div>
        <p className="text-gray-500 text-sm">Choose a class to manage assignments</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <BookOpen className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Classes Found</h3>
          <p className="text-gray-500">You haven't created any classes yet.</p>
        </div>
      ) : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCards.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative">
                  <img 
                    src={item.thumbnail.secure_url} 
                    alt={item.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-semibold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-auto pt-4">
                    <button 
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
                      onClick={() => handleClick(item._id)}
                    >
                      View assignments
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-l-md border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-200' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="px-4 py-2 bg-white text-gray-700 border-t border-b border-gray-200">
                  {currentPage} / {totalPages}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-r-md border ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 border-gray-200' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassListOfTeachers;