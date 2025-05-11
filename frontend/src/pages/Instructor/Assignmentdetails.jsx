import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import { useDeleteAssignmentMutation } from '../../redux/api/assignmentApiSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileText, User, Download, Edit, Trash2 } from 'lucide-react';
import { useLazyGetUserDetailsQuery } from '../../redux/api/usersApiSlice';
import { useEffect } from 'react';

const AssignmentDetails = () => {
  const { assignmentInfo } = useSelector(state => state.assignment);
  const { assignmentId } = useSelector(state => state.assignment);
  const [deleteAssignment] = useDeleteAssignmentMutation();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [getUser]=useLazyGetUserDetailsQuery();
  const [teacher,setTeacherName]=useState("");



  // Find the selected assignment
  const selectedAssignment = assignmentInfo.find(item => item._id === assignmentId) || {};
  const { title: asiTitle = '', teacher: asiTeacher = '', lecDocument = {} } = selectedAssignment;
  const secUrl = lecDocument?.secure_url || '';

  useEffect(()=>{

    const fetchTeacher=async ()=>{

      const res=await getUser(selectedAssignment.createdBy).unwrap();
      if(res){
      setTeacherName(res.username);}
      
    }

    fetchTeacher();



  },[])

  const handleUpdateClick = () => {
    navigate('/instructor/updateassignment');
  };
  
  const deleteDocument = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteAssignment(assignmentId);
      toast.success("Assignment successfully deleted!");
      // You may want to navigate away after successful deletion
      setTimeout(() => navigate('/instructor/allassignments'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the assignment');
      toast.error(error || 'Error deleting assignment');
    } finally {
      setIsDeleting(false);
    }
  };

  const showDeleteConfirmation = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="mb-4 font-medium">Are you sure you want to delete this assignment?</p>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={closeToast} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                closeToast();
                deleteDocument();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-1" /> Delete
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
  
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
      {/* Header with gradient background */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h1 className="text-white text-2xl font-bold text-center">{asiTitle}</h1>
        </div>
      </div>

      {/* Assignment details */}
      <div className="p-6">
        <div className="space-y-5 mb-6">
          <div className="flex items-center">
            <FileText size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Assignment Title</p>
              <p className="font-medium text-gray-800">{asiTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Teacher</p>
              <p className="font-medium text-gray-800">{teacher}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Download size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Document</p>
              <a 
                href={secUrl} 
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Assignment
              </a>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
            onClick={handleUpdateClick}
          >
            <Edit size={16} className="mr-1" /> Update
          </button>
          
          <button 
            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
            onClick={showDeleteConfirmation} 
            disabled={isDeleting}
          >
            <Trash2 size={16} className="mr-1" /> {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;