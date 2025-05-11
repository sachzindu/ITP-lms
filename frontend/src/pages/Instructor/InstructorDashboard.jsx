import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  
  const handleAssignmentManagement = () => {
    toast.info("Redirecting to assignment management...");
    navigate("/instructor/classlistofteacher");
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-3xl">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Instructor Dashboard
        </h2>

        <div className="bg-[#1e81b0] text-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold mb-4">Assignment Management</h3>
            <p className="text-base mb-6 max-w-md">
              Create, update, or delete assignments for your students. Track progress and manage all your class assignments from one place.
            </p>
            <button
              onClick={handleAssignmentManagement}
              className="bg-white text-[#1e81b0] font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-sm"
            >
              Manage Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;