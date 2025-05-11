import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { useUpdateClassMutation } from '../../redux/api/classesApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const UpdateClass = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alyear: '',
    alstream: '',
    createdBy: ''
  });

 

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {userInfo}=useSelector(state => state.auth);
  const { courseInfo } = useSelector(state => state.course);
  const { classIdInfo } = useSelector(state => state.classId);
  const [updateClass] = useUpdateClassMutation();
  const navigate=useNavigate();

  useEffect(() => {
    if(!userInfo && !(userInfo.role == "admin")) {
        navigate('/login')
    }
}, [navigate, userInfo]);


  // Find the class that matches the classIdInfo
  const matchedClass = courseInfo.find(item => item._id == classIdInfo) || null;

  // useEffect to populate form with existing data when component mounts or classIdInfo changes
  useEffect(() => {
    if (matchedClass) {
      setFormData({
        title: matchedClass.title || '',
        description: matchedClass.description || '',
        alyear: matchedClass.alyear || '',
        alstream: matchedClass.alstream || '',
        createdBy: matchedClass.createdBy || ''
      });
      
      // Set thumbnail preview if exists
      if (matchedClass.thumbnail) {
        setThumbnailPreview(matchedClass.thumbnail);
      }
    }
  }, [matchedClass, classIdInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const resetForm = () => {
    // Reset to the original matched class data instead of empty values
    if (matchedClass) {
      setFormData({
        title: matchedClass.title || '',
        description: matchedClass.description || '',
        alyear: matchedClass.alyear || '',
        teacher: matchedClass.teacher || '',
        alstream: matchedClass.alstream || '',
        createdBy: matchedClass.createdBy || ''
      });
      
      // Reset thumbnail to original if exists
      setThumbnail(null);
      if (matchedClass.thumbnail) {
        setThumbnailPreview(matchedClass.thumbnail);
      } else {
        setThumbnailPreview(null);
      }
    } else {
      // If no matched class, reset to empty
      setFormData({
        title: '',
        description: '',
        alyear: '',
        alstream: '',
        createdBy: ''
      });
      setThumbnail(null);
      setThumbnailPreview(null);
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append thumbnail if exists
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

    
      console.log(classIdInfo);
      // Send data to your backend
      await updateClass({classId:classIdInfo,body:formDataToSend}).unwrap();

      setSuccess('Class updated successfully!');
      toast.success("Class updated successfully");
      navigate('/admin/allclasses');
    } catch (err) {
      // Fix error handling for RTK Query
      setError(err.data?.message || 'Failed to update class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state or error if no matching class found
  if (!matchedClass) {
    return (
      <div className="max-w-md mx-auto bg-[#eeeee4] rounded-lg shadow-md p-6 my-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Update Class</h2>
        <div className="p-4 text-center">
          {classIdInfo ? 'Loading class data...' : 'No class selected to update.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Update Class</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="classTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Class Title
          </label>
          <input
            type="text"
            id="classTitle"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="classDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Class Description
          </label>
          <textarea
            id="classDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="alYear" className="block text-sm font-medium text-gray-700 mb-1">
            A/L Year
          </label>
          <input
            type="text"
            id="alYear"
            name="alyear"
            value={formData.alyear}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
            Created By
          </label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="alStream" className="block text-sm font-medium text-gray-700 mb-1">
            A/L Stream
          </label>
          <select
            id="alStream"
            name="alstream"
            value={formData.alstream}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select A/L Stream</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
            <option value="Bio">Bio</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        
       
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClass;