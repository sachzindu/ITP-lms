import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const InstructorDashboard = () => {
  const handleCourseManagement = () => {
    toast.info("Redirecting to course management...");
  };

  const handleStudentManagement = () => {
    toast.info("Redirecting to student management...");
  };

  const handleProfileUpdate = () => {
    toast.info("Redirecting to profile update...");
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-4xl">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Instructor Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#1e81b0] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Manage Courses</h3>
            <p className="text-sm mb-4">
              Create, update, or delete courses for your students.
            </p>
            <button
              onClick={handleCourseManagement}
              className="bg-white text-[#1e81b0] font-semibold py-2 px-6 rounded-lg hover:bg-[#1e81b0] hover:text-white transition"
            >
              Manage Courses
            </button>
          </div>

          <div className="bg-[#1e81b0] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Student Management</h3>
            <p className="text-sm mb-4">
              View and manage students who are enrolled in your courses.
            </p>
            <button
              onClick={handleStudentManagement}
              className="bg-white text-[#1e81b0] font-semibold py-2 px-6 rounded-lg hover:bg-[#1e81b0] hover:text-white transition"
            >
              Manage Students
            </button>
          </div>

          <div className="bg-[#1e81b0] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
            <p className="text-sm mb-4">
              Update your personal details and account settings.
            </p>
            <button
              onClick={handleProfileUpdate}
              className="bg-white text-[#1e81b0] font-semibold py-2 px-6 rounded-lg hover:bg-[#1e81b0] hover:text-white transition"
            >
              Update Profile
            </button>
          </div>

          <div className="bg-[#1e81b0] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">View Reports</h3>
            <p className="text-sm mb-4">
              View your teaching reports, student progress, and feedback.
            </p>
            <Link
              to="/reports"
              className="bg-white text-[#1e81b0] font-semibold py-2 px-6 rounded-lg hover:bg-[#1e81b0] hover:text-white transition"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
