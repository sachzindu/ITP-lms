import React, { useEffect, useState } from "react";
import { useCreateAssignmentMutation } from "../../redux/api/assignmentApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyGetClassesByTeacherIdQuery } from "../../redux/api/classesApiSlice";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alyear: "",
    alstream: "",
    alclass: "", // alclass will store the _id of the selected class
  });
  
  const [errors, setErrors] = useState({
    title: "",
    alyear: "",
  });
  
  const { userInfo } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getClassesByTeacherId] = useLazyGetClassesByTeacherIdQuery();
  const [classOptions, setClassOptions] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const responseObj = await getClassesByTeacherId(userInfo._id).unwrap();
        console.log(responseObj);
        setClassOptions(responseObj.classes);
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    };

    fetchClasses();
  }, [userInfo, getClassesByTeacherId]);

  // Destructure the mutation hook
  const [createAssignment] = useCreateAssignmentMutation();

  // Validate specific fields
  const validateField = (name, value) => {
    let errorMessage = "";
    
    switch (name) {
      case "title":
        if (value.trim().length < 8) {
          errorMessage = "Title must be at least 8 characters long";
        }
        break;
      case "alyear":
        // Check if it's exactly 4 digits
        const yearRegex = /^\d{4}$/;
        if (!yearRegex.test(value)) {
          errorMessage = "Year must be exactly 4 digits";
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  // Handle input/select change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate fields that have specific requirements
    if (name === "title" || name === "alyear") {
      const errorMessage = validateField(name, value);
      setErrors({
        ...errors,
        [name]: errorMessage,
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        // Clear any previous file type error toast
        toast.dismiss("file-type-error");
      } else {
        // Show error toast for invalid file type
        toast.error("Only PDF files are allowed.", { toastId: "file-type-error" });
        setFile(null);
        // Clear the file input visually
        e.target.value = null;
      }
    } else {
      // If user clears the file input
      setFile(null);
      toast.dismiss("file-type-error");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation on all fields before submission
    const titleError = validateField("title", formData.title);
    const yearError = validateField("alyear", formData.alyear);
    
    // Update error state
    setErrors({
      title: titleError,
      alyear: yearError,
    });
    
    // Stop submission if there are errors
    if (titleError || yearError) {
      return;
    }
    
    setIsSubmitting(true);

    // --- Input Validation ---
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the assignment.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description for the assignment.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.alyear.trim()) {
      toast.error("Please enter the A/L year.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.alstream.trim()) {
      toast.error("Please enter the A/L stream.");
      setIsSubmitting(false);
      return;
    }
    // Validation for the select field - check if a specific option (not the default empty one) is selected
    if (!formData.alclass) {
      toast.error("Please select the A/L class.");
      setIsSubmitting(false);
      return;
    }
    if (!file) {
      toast.error("Please upload the assignment document (PDF).");
      setIsSubmitting(false);
      return;
    }
    // --- End Validation ---

    try {
      const submitData = new FormData();

      // Append form data fields
      Object.keys(formData).forEach((key) => {
        // For alclass, formData[key] is already the _id from the select
        submitData.append(key, key === 'alclass' ? formData[key] : formData[key].trim());
      });

      // Append the file
      submitData.append("lecFile", file); // Ensure "lecFile" matches backend expected field name

      // Append createdBy - Safely access _id
      if (userInfo?._id) {
        submitData.append("createdBy", userInfo._id);
      } else {
        // Handle case where userInfo or _id is missing (e.g., user not logged in)
        toast.error("User information is missing. Please log in again.");
        setIsSubmitting(false);
        return; // Stop submission if user info is missing
      }

      // Perform the mutation
      const asRes = await createAssignment(submitData).unwrap();

      // Assuming the response contains success information
      toast.success("Assignment created successfully!");
      handleReset(); // Reset form on success

    } catch (error) {
      // Log the error for debugging
      console.error("Failed to create assignment:", error);

      // Provide a more informative error message if possible
      const errorMessage = error?.data?.message || "Failed to create assignment. Please try again.";
      toast.error(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      alyear: "",
      alstream: "",
      alclass: "", // Reset select to default empty value
    });
    setErrors({
      title: "",
      alyear: "",
    });
    setFile(null);
    // Optionally reset file input value for visual clarity
    const fileInput = document.getElementById('document');
    if (fileInput) {
      fileInput.value = null;
    }
    toast.dismiss("file-type-error"); // Dismiss file error toast on reset
  };

  // Data structure for inputs to better manage rendering and labels
  const formFields = [
    { 
      name: "title", 
      label: "Title", 
      type: "text", 
      placeholder: "Enter assignment title (min. 8 characters)",
      hasValidation: true
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea", 
      placeholder: "Enter assignment description" 
    },
    { 
      name: "alyear", 
      label: "A/L Year", 
      type: "text", 
      placeholder: "Enter A/L Year (4 digits)",
      hasValidation: true
    },
    { 
      name: "alstream", 
      label: "A/L Stream", 
      type: "text", 
      placeholder: "Enter A/L Stream" 
    },
    { 
      name: "alclass", 
      label: "A/L Class", 
      type: "select", 
      placeholder: "Select A/L Class" 
    },
  ];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Assignment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dynamically render form fields */}
        {formFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 capitalize">
              {field.label}
            </label>
            
            {/* Conditional rendering based on field type */}
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300 h-32"
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300 bg-white"
              >
                {/* Default empty option */}
                <option value="">{field.placeholder}</option>
                {/* Map over classOptions to create select options */}
                {classOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  errors[field.name] ? "border-red-300 ring-red-300" : "border-gray-300"
                }`}
                placeholder={field.placeholder}
              />
            )}
            
            {/* Display validation error if exists */}
            {field.hasValidation && errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* File Upload */}
        <div className="space-y-2">
          <label htmlFor="document" className="block text-sm font-medium text-gray-700">
            Upload Document (PDF only)
          </label>
          <input
            type="file"
            id="document"
            name="lecFile"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            disabled={isSubmitting}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;