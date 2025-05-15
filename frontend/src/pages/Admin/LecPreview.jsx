import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { File, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useDeleteLecMutation, useLazyGetLecsQuery } from "../../redux/api/lecsApiSlice";
import { setCredentials, setLecId } from "../../redux/features/services/lecSlice";
import { toast } from "react-toastify";

const VALID_MONTH_NAMES = [
  'january', 'february', 'march', 'april',
  'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december'
];



const LecPreview = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { lecId } = useSelector(state => state.lec);
  const { classIdInfo } = useSelector(state => state.classId);
  const { lecInfo } = useSelector(state => state.lec);
  const dispatch = useDispatch();
  const [getLecs] = useLazyGetLecsQuery();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLec] = useDeleteLecMutation();
  
  useEffect(() => {
    if(!userInfo && !(userInfo?.role === "admin")) {
      navigate('/login');
    }
  }, [navigate, userInfo]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLecs().unwrap();
        dispatch(setCredentials(response.lec));
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    fetchData();
  }, []);
  
  // Safely initialize materials from context
  useEffect(() => {
    if (Array.isArray(lecInfo)) {
      setMaterials(
        lecInfo.filter(m => m.courseOfVideo === classIdInfo)
      );
    }
  }, [lecInfo, classIdInfo]);

  const handleDelete = async(id) => {
    // Confirm before deleting
    setIsDeleting(true);
    setError("");
    
    try {
      // Make the DELETE request using Axios
      const response = await deleteLec(id).unwrap();
      
      console.log('Delete successful:', response.data);
      
      // Update the UI by removing the deleted item
      setMaterials(materials.filter(material => material._id !== id));
      
      // Show a success message
      toast.info("Item deleted successfully");
      
    } catch (error) {
      // Handle error scenarios
      setError(error.message || "An error occurred");
      
      if (error.response) {
        // The server responded with an error status
        console.error('Server error:', error.response.data);
        alert(`Error deleting document: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // No response received
        console.error('No response from server:', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something else went wrong
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit material with ID:", id);
    dispatch(setLecId(id));
    navigate('/admin/updatelec');
    // Implement edit functionality
  };

  const handleAddNew = () => {
    navigate('/admin/createlec');
  };
      
  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      {/* Header section with Add New button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Preview Course Materials</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Add New
        </button>
      </div>
      <hr className="mb-6" />

      {loading ? (
        <p className="text-center text-gray-500">Loading materials...</p>
      ) : materials.length === 0 ? (
        <p className="text-center text-gray-500">No materials available</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li key={material._id} className="p-4 border rounded shadow-sm flex justify-between items-center mb-9">
              <div>
                <p className="font-semibold text-4xl flex justify-center text-red-700">{material.month}</p><br></br>
                <p className="font-semibold mb-5 text-2xl text-red-500">{material.week}</p>
                <p className="font-semibold text-blue-950">{material.title}</p>
                {material.lecVideo && material.lecVideo.secure_url ? (
                  <video controls controlsList="nodownload" disablePictureInPicture className="w-full max-w-md mt-2">
                    <source src={material.lecVideo.secure_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>) : 
                 (
                  <p className="text-gray-500">No video available</p>
                )}

                <p className="font-semibold mb-5 text-blue-950 mt-9">{material.description}</p>
                {material.lecDocument && material.lecDocument.secure_url ? (
                  <a className="w-full max-w-md text-red-800" href={material.lecDocument.secure_url}>
                    <File className="w-6 h-6 text-blue-600 my-3" />Click to download file
                  </a>) : 
                 (
                  <p className="text-gray-500">No documents available</p>
                )}
              </div>

              <div className="space-x-2">
                <button 
                  onClick={() => handleEdit(material._id)} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-2 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(material._id)} 
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold p-2 rounded"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

     
    </div>
  );
};

export default LecPreview;