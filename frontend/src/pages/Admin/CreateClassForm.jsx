import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { XCircle } from 'lucide-react';
import { useCreateClassMutation } from '../../redux/api/classesApiSlice';
import { useLazyGetTeachersNameIdQuery } from '../../redux/api/usersApiSlice';
import { useNavigate } from 'react-router';

const CreateClassForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alyear: '',
    alstream: '',
    createdBy: ''
  });
  
  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    alyear: '',
    createdBy: ''
  });
  
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createClass] = useCreateClassMutation();
  const [dropDownItems, setDropdownItems] = useState([]);
  const [getTeacherNameId] = useLazyGetTeachersNameIdQuery();
  const [selectedItem, setSelectedItem] = useState("");
  const navigate=useNavigate();

  // Validation function
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'title':
        if (value.length < 8) {
          errorMessage = 'Class title must be at least 8 characters';
        }
        break;
      case 'alyear':
        if (!/^\d{4}$/.test(value) && value !== '') {
          errorMessage = 'A/L Year must be a 4-digit number';
        }
        break;
      case 'createdBy':
        if (value !== 'admin' && value !== '') {
          errorMessage = 'Only "admin" is allowed';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate the field
    const errorMessage = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  useEffect(() => {
    const fetchDropdownItems = async () => {
      try {
        const result = await getTeacherNameId().unwrap();
        setDropdownItems(result.teachers);
      } catch (err) {
        toast.error("Failed to load teacher names");
      }
    };
    
    fetchDropdownItems();
  }, []);

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
    setFormData({
      title: '',
      description: '',
      alyear: '',
      alstream: '',
      createdBy: ''
    });
    setValidationErrors({
      title: '',
      alyear: '',
      createdBy: ''
    });
    setThumbnail(null);
    setThumbnailPreview(null);
    setError('');
    setSuccess('');
    setSelectedItem("");
  };

  // Form validation before submission
  const isFormValid = () => {
    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    
    // Check required fields
    const titleValid = formData.title.length >= 8;
    const createdByValid = formData.createdBy === 'admin';
    const yearValid = /^\d{4}$/.test(formData.alyear);
    const teacherSelected = selectedItem !== '';
    
    return !hasErrors && titleValid && createdByValid && yearValid && teacherSelected;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Perform final validation check
    const titleError = validateField('title', formData.title);
    const yearError = validateField('alyear', formData.alyear);
    const createdByError = validateField('createdBy', formData.createdBy);
    
    setValidationErrors({
      title: titleError,
      alyear: yearError,
      createdBy: createdByError
    });
    
    if (!isFormValid()) {
      setError('Please fix validation errors before submitting');
      return;
    }
    
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

      formDataToSend.append('teacher', selectedItem);

      // Send data to your backend
      const response = await createClass(formDataToSend).unwrap();

      setSuccess('Class created successfully!');
      toast.success("Class created successfully!");
      // Reset the form after successful submission
      resetForm();
      navigate('/admin/allclasses');
      
    } catch (err) {
      setError(err?.data?.message || 'Failed to create class. Please try again.');
      toast.error("Error creating class");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto bg-[#eeeee4] rounded-lg shadow-md p-6 my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New Class</h2>
      
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
            Class Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="classTitle"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {validationErrors.title && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters required</p>
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
            A/L Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="alYear"
            name="alyear"
            value={formData.alyear}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${validationErrors.alyear ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {validationErrors.alyear && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.alyear}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Must be a 4-digit number</p>
        </div>
        
        <div>
          <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
            Created By <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${validationErrors.createdBy ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {validationErrors.createdBy && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.createdBy}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Only "admin" is allowed</p>
        </div>
        
        <div>
          <label htmlFor="alStream" className="block text-sm font-medium text-gray-700 mb-1">
            A/L Stream <span className="text-red-500">*</span>
          </label>
          <select
            id="alStream"
            name="alstream"
            value={formData.alstream}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select A/L Stream</option>
            <option value="Science">Bio Science</option>
            <option value="Mathematics">Physical Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
            Teacher <span className="text-red-500">*</span>
          </label>
          <select 
            id="teacher"
            value={selectedItem}
            onChange={handleItemChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select teacher</option>
            {dropDownItems.map(item => (
              <option key={item._id} value={item._id}>
                {item.username}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          {!thumbnailPreview ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="thumbnail"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-32 w-auto object-cover rounded-md"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full shadow-sm p-1"
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </button>
            </div>
          )}
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
            disabled={isSubmitting || !isFormValid()}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              (isSubmitting || !isFormValid()) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassForm;