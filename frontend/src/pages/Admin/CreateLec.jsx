import React from "react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useCreateLecMutation } from "../../redux/api/lecsApiSlice";
import { toast } from "react-toastify";
import { useLazyGetClassesNameIdQuery } from "../../redux/api/classesApiSlice";
import { useSelector } from "react-redux";

const CreateLec = () => {
  const { userInfo } = useSelector(state => state.auth);
  const [createLec] = useCreateLecMutation();
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
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
  const [yearError, setYearError] = useState("");
  const [weekError, setWeekError] = useState("");
  const [materials, setMaterials] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [getClassNameId] = useLazyGetClassesNameIdQuery();
  const [dropDownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    if(!userInfo || userInfo.role !== "admin") {
      navigate('/login');
    }
  }, [navigate, userInfo]);
  
  useEffect(() => {
    const fetchDropdownItems = async () => {
      try {
        const result = await getClassNameId().unwrap();
        console.log(result);
        setDropdownItems(result.lec);
      } catch (err) {
        toast.error("Failed to load class names");
      }
    };
    
    fetchDropdownItems();
  }, [getClassNameId]);

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

  const handleAlClassChange = (e) => {
    const value = e.target.value;
    setAlclass(value);
    validateYear(value);
  };

  const handleUpload = async() => {
    if (!month || !week || !title || !pdfFile || !description || !alclass || !createdBy || !selectedItem) {
      toast.warn("Missing fields!");
      return;
    }
    
    // Validate year before submitting
    if (!validateYear(alclass)) {
      toast.error("Please enter a valid 4-digit year");
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
      selectedItem,
      videoFileName: videoFile ? videoFile.name : null, 
      pdfFileName: pdfFile ? pdfFile.name : null
    };
    
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);

    const formData = new FormData();
    if (videoFile) {
      formData.append("lecVideo", videoFile);
    }
    formData.append("title", title);
    formData.append("lecFile", pdfFile);
    formData.append("month", month);
    formData.append("week", week);
    formData.append("description", description);
    formData.append("alclass", alclass);
    formData.append("createdBy", createdBy);
    formData.append("courseOfVideo", selectedItem);

    try {
      const response = await createLec(formData).unwrap();

      console.log("Upload successful:", response);
      toast.success("Video uploaded successfully!");
      navigate('/admin/previewlec');
      
      // Clear form fields after successful upload
      setMonth("");
      setWeek("");
      setTitle("");
      setDescription("");
      setAlclass("");
      setCreatedBy("");
      setSelectedItem("");
      setVideoFile(null);
      setPdfFile(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";

    } catch (error) {
      toast.error("Upload failed");
      
    } finally {
      setIsUploading(false);
    }
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Upload Course Materials</h1>
      <hr className="mb-6" />

      <div className="mb-4 space-y-2">
        {/* Month dropdown selector instead of text input */}
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
        <input type="text" placeholder="Enter recording title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded w-full mb-5" />
        <input type="text" placeholder="Enter video description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border rounded w-full mb-5" />
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
        <input type="text" placeholder="Created by" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="p-2 border rounded w-full mb-5" />
        
        {/* Class selection dropdown */}
        <select 
          value={selectedItem}
          onChange={handleItemChange}
          className="p-2 border rounded w-full mb-5"
        >
          <option value="">Select class</option>
          {dropDownItems.map(item => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
        
        <h1 className="mt-5">Upload the class recording</h1>
        <input 
          id="video-input" 
          type="file" 
          accept="video/*" 
          onChange={(e) => setVideoFile(e.target.files[0] || null)} 
          className="p-2 border rounded w-full" 
          ref={videoInputRef}
        />
        
        <h1 className="mt-5">Upload the class note PDF</h1>
        <input 
          id="pdf-input" 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setPdfFile(e.target.files[0] || null)} 
          className="p-2 border rounded w-full" 
          ref={pdfInputRef} 
          required
        />
        
        <button 
          onClick={handleUpload} 
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded w-full mt-8"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <button 
        onClick={() => navigate('/Preview')} 
        className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded w-full"
      >
        Preview
      </button>
    </div>
  );
};

export default CreateLec;