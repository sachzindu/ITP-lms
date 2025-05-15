import { useSelector } from 'react-redux';
import React, {useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteClassMutation} from '../../redux/api/classesApiSlice'; 
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Classdetails = () => {
  const {userInfo}=useSelector(state=>state.auth)
  const {courseInfo}=useSelector(state=>state.course);
  const {classIdInfo}=useSelector(state=>state.classId);
 
  const [deleteUser]=useDeleteClassMutation();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  let clzTitle = '';
  let clzTeacher = '';
  let secUrl = '';
  let uid=classIdInfo;

   useEffect(() => {
        if(!userInfo && !(userInfo.role === "admin")) {
            navigate('/login')
        }
    }, [navigate, userInfo]);
  

  courseInfo.forEach((item) => {
    if (item._id == uid) {
      clzTitle = item.title;
      
      secUrl = item.thumbnail.secure_url;
    }
  });

 

  const handleClick = async () => {
    navigate('/admin/updateclass');
  };

  const showDeleteConfirmation = () => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="mb-4">Are you sure you want to delete this class?</p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => {
                closeToast();
                deleteDocument();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button 
              onClick={closeToast} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false
      }
    );
  };
  
  const deleteDocument = async () => {
    // Reset states
    
    
    
    try {
      // Make the DELETE request to your API endpoint
     setIsDeleting(true);
      await deleteUser(uid);

      // If successful, call the success callback
      toast.success("Class deleted successfully!");
      navigate("/admin/allclasses");
    } catch (err) {
      // Handle any errors
      toast.error(err?.data?.message || err.message)
     console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
      
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8 transition-all duration-300 hover:shadow-xl">
      {/* Header image with gradient overlay and text */}
      <div className="relative h-56">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-indigo-900/90 mix-blend-multiply" />
        <img 
          src={secUrl} 
          alt="Class cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <h1 className="text-white text-3xl font-bold text-center drop-shadow-md">{clzTitle}</h1>
          <div className="mt-2 px-4 py-1 bg-amber-500 rounded-full">
            <p className="text-white text-sm font-medium">Premium Class</p>
          </div>
        </div>
      </div>

      {/* Class details container */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .137.112.25.25.25h.5a.25.25 0 00.25-.25v-.5a.249.249 0 01.25-.25h1.5a.249.249 0 01.25.25v.5a.25.25 0 00.25.25h.5a.25.25 0 00.25-.25v-.5a.249.249 0 01.25-.25h1.5a.25.25 0 01.25.25v.5a.25.25 0 00.25.25h.5a.25.25 0 00.25-.25v-1.069l2.078-.885a1 1 0 00.575-.906v-.503a1 1 0 00-.575-.906l-6.5-2.786zM7.5 11.5V10h1v1.5a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5zm4 0V10h1v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5z" />
            </svg>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Course Title</p>
              <p className="font-medium text-gray-800">{clzTitle}</p>
            </div>
          </div>
      
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tuition Fee</p>
              <p className="font-medium text-gray-800">Rs 3,500.00</p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
            onClick={handleClick} >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Update
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
            onClick={showDeleteConfirmation} 
            disabled={isDeleting}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Classdetails;