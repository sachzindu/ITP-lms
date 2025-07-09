import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUpdateAssignmentMutation } from "../../redux/api/assignmentApiSlice";

const UpdateAssignment = () => {
  // State to hold form data - only title and description
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  
  // State for displaying messages (success/error)
  const [message, setMessage] = useState("");

  // Get assignment information and the ID of the assignment to update from Redux state
  const { assignmentInfo } = useSelector((state) => state.assignment);
  const { assignmentId } = useSelector((state) => state.assignment);

  // Use the RTK Query mutation hook for updating
  const [
    updateAssignment,
    { isLoading, isSuccess, isError, error },
  ] = useUpdateAssignmentMutation();

  // Effect to load assignment data when component mounts or dependencies change
  useEffect(() => {
    if (assignmentInfo && assignmentId) {
      const assignmentToUpdate = assignmentInfo.find(
        (assignment) => assignment._id == assignmentId
      );

      if (assignmentToUpdate) {
        // Extract only the fields we need
        const { title, description } = assignmentToUpdate;
        setFormData({
          title: title || "",
          description: description || "",
        });
      } else {
        setMessage("Error: Assignment not found in list.");
      }
    }
  }, [assignmentInfo, assignmentId]);

  // Effect to handle messages based on mutation state
  useEffect(() => {
    if (isSuccess) {
      setMessage("Assignment updated successfully!");
    } else if (isError) {
      console.error("Update failed:", error);
      setMessage(`Failed to update assignment: ${error?.data?.message || error?.error || 'An unknown error occurred'}`);
    } else {
      setMessage('');
    }
  }, [isSuccess, isError, error]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();

    // Append all fields from formData
    Object.keys(formData).forEach((key) => {
      dataToSubmit.append(key, formData[key]);
    });

    // Append the file ONLY if a new one has been selected
  

    try {
      await updateAssignment({ id: assignmentId, body: dataToSubmit }).unwrap();
    } catch (err) {
      // Error handling is done in the useEffect
    }
  };

  // Handle form reset
  const handleReset = () => {
    setMessage('');

    if (assignmentInfo && assignmentId) {
      const assignmentToUpdate = assignmentInfo.find(
        (assignment) => assignment._id === assignmentId
      );
      if (assignmentToUpdate) {
        const { title, description } = assignmentToUpdate;
        setFormData({
          title: title || "",
          description: description || "",
        });
      } else {
        setFormData({
          title: "", 
          description: "", 
        });
        setMessage("Could not reset to original data: Assignment not found.");
      }
    } else {
      setFormData({
        title: "", 
        description: "", 
      });
      setMessage("Assignment information not available to reset.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Assignment</h2>

      {/* Display messages */}
      {message && (
        <p className={`text-center text-sm mb-4 ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      {!assignmentInfo && <p className="text-center">Loading assignment data...</p>}
      {assignmentInfo && !assignmentInfo.find(a => a._id === assignmentId) && assignmentId && !message.includes("Error") && (
        <p className="text-center text-yellow-600">Finding assignment...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title field */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="Enter title"
          />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 border-gray-300"
            placeholder="Enter description"
          />
        </div>

       
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            disabled={isLoading}
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Update Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAssignment;