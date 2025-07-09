import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateLecMutation } from "../../redux/api/lecsApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyGetUserDetailsQuery } from "../../redux/api/usersApiSlice";

const UpdateLec = () => {
  const [updateLec] = useUpdateLecMutation();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const [getUserDetails]=useLazyGetUserDetailsQuery();

  // Month options array
  const monthOptions = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Week options array
  const weekOptions = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alclass, setAlclass] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [materials, setMaterials] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Validation states
  const [yearError, setYearError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  
  const { lecInfo } = useSelector(state => state.lec);
  const { lecId } = useSelector(state => state.lec);
  const matchedClass = lecInfo.find(item => item._id === lecId) || null;
  const [teacherName,setTeacherName]=useState("");

  useEffect(() => {
    if(!userInfo || userInfo.role !== "admin") {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(()=>{

    const getUDetails=async ()=>{
      const res=await getUserDetails(matchedClass.teacher);
      if(res){
        setTeacherName(res?.user?.username);

      }
    }

    getUDetails();

  },[getUserDetails,matchedClass])
      
  // Use useEffect to populate form fields when matchedClass is available
  useEffect(() => {
    if (matchedClass) {
      setMonth(matchedClass.month || "");
      setWeek(matchedClass.week || "");
      setTitle(matchedClass.title || "");
      setDescription(matchedClass.description || "");
      setAlclass(matchedClass.alclass || "");
      setCreatedBy(matchedClass.createdBy || "");
    }
  }, [matchedClass]); // This effect runs when matchedClass changes

  // Validate year input (4 digits only)
  const validateYear = (input) => {
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(input)) {
      setYearError("Please enter a valid 4-digit year");
      return false;
    }
    setYearError("");
    return true;
  };

  // Handle year input change
  const handleAlClassChange = (e) => {
    const value = e.target.value;
    setAlclass(value);
    validateYear(value);
  };

  // Validate title (not empty and at least 3 characters)
  const validateTitle = (input) => {
    if (!input || input.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      return false;
    }
    setTitleError("");
    return true;
  };

  // Handle title input change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateTitle(value);
  };

  // Validate description (not empty and at least 10 characters)
  const validateDescription = (input) => {
    if (!input || input.trim().length < 10) {
      setDescriptionError("Description must be at least 10 characters");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    validateDescription(value);
  };

  const handleUpdate = async() => {
    // Check if all required fields are filled
    if (!title || !month || !week || !description || !alclass || !createdBy) {
      toast.warn("Please fill in all fields");
      return;
    }
    
    // Run validations before submitting
    const isYearValid = validateYear(alclass);
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    
    // If any validations fail, prevent form submission
    if (!isYearValid || !isTitleValid || !isDescriptionValid) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsUploading(true);

    const newMaterial = { 
      id: Date.now(), 
      month, 
      week,
      title, 
      description, 
      alclass, 
      createdBy,
    };
    
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("month", month);
    formData.append("week", week);
    formData.append("description", description);
    formData.append("alclass", alclass);
    formData.append("createdBy", createdBy);

    try {
      const response = await updateLec({id: lecId, body: formData}).unwrap();

      console.log("Update successful:", response);
      toast.success("Lecture updated successfully!");
      navigate('/admin/previewlec');
      
      // Clear form fields after successful upload
      setMonth("");
      setWeek("");
      setTitle("");
      setDescription("");
      setAlclass("");
      setCreatedBy("");

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed: " + (error?.data?.message || error?.message || "Unknown error"));

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Course Materials Update</h1>
      <hr className="mb-6" />

      <div className="mb-4 space-y-2">
        {/* Month dropdown selector */}
        <select 
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border rounded w-full mb-5"
          required
        >
          <option value="">Select Month</option>
          {monthOptions.map((monthName) => (
            <option key={monthName} value={monthName}>
              {monthName}
            </option>
          ))}
        </select>
        
        {/* Week dropdown selector */}
        <select 
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="p-2 border rounded w-full mb-5"
          required
        >
          <option value="">Select Week</option>
          {weekOptions.map((weekOption) => (
            <option key={weekOption} value={weekOption}>
              {weekOption}
            </option>
          ))}
        </select>
        
        {/* Title input with validation */}
        <div className="mb-5">
          <input 
            type="text" 
            placeholder="Enter recording title" 
            value={title} 
            onChange={handleTitleChange}
            className={`p-2 border rounded w-full ${titleError ? 'border-red-500' : ''}`}
            required 
          />
          {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
        </div>
        
        {/* Description input with validation */}
        <div className="mb-5">
          <input 
            type="text" 
            placeholder="Enter PDF description" 
            value={description} 
            onChange={handleDescriptionChange}
            className={`p-2 border rounded w-full ${descriptionError ? 'border-red-500' : ''}`}
            required 
          />
          {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
        </div>
        
        {/* Year input with validation */}
        <div className="mb-5">
          <input 
            type="text" 
            placeholder="Enter year of A/L (4 digits)" 
            value={alclass} 
            onChange={handleAlClassChange}
            className={`p-2 border rounded w-full ${yearError ? 'border-red-500' : ''}`}
            maxLength={4}
            pattern="\d{4}"
            required 
          />
          {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
        </div>
        
        <input 
          type="text" 
          placeholder="Created by" 
          value={createdBy} 
          onChange={(e) => setCreatedBy(e.target.value)} 
          className="p-2 border rounded w-full mb-5"
          required
        />
        
        <button 
          onClick={handleUpdate} 
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded w-full mt-8"
        >
          {isUploading ? "Updating..." : "Update"}
        </button>
      </div>

     
    </div>
  );
};

export default UpdateLec;