import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; // Import NavLink and Outlet
import { FaBookOpen, FaGraduationCap, FaTachometerAlt, FaFile ,FaVideo} from 'react-icons/fa'; // Example icons


const StudentDashboardLayout = () => {
  // Define a base style for NavLink
  const baseLinkClass = "flex items-center py-2.5 px-4 rounded-lg transition duration-200 ease-in-out";
  // Define style for inactive NavLink
  const inactiveLinkClass = "text-gray-700 hover:bg-gray-200 hover:text-gray-900";
  // Define style for active NavLink
  const activeLinkClass = "bg-[#1e81b0] text-white font-medium shadow-sm";

  // Function to determine className based on active state
  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  return (
    <div className="flex min-h-screen bg-zinc-200 bg-opacity-50 p-4 rounded">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Dashboard</h2>
        <nav className="flex-grow space-y-4">
          {/* Add a link to the main dashboard welcome page */}
         
          <NavLink
            to="/student/dashboard" // Updated path for nested route
            className={getNavLinkClass}
          >
             <FaBookOpen className="mr-3" /> All Classes
          </NavLink>
          <NavLink
            to="/student/enrolled" // Updated path for nested route
            className={getNavLinkClass}
          >
            <FaTachometerAlt className="mr-3" /> Enrolled classes
          </NavLink>
          <NavLink
            to="/student/classlistassignment" // Updated path for nested route
            className={getNavLinkClass}
          >
            <FaFile className="mr-3" /> Assignments
          </NavLink>
          <NavLink
          to="/student/classlistvideo"
            className={getNavLinkClass}
          >
            <FaVideo className="mr-3" /> Lectures
          </NavLink>
        </nav>
         {/* Optional: Add logout or settings at the bottom */}
         <div className="mt-auto">
            {/* Example: <button className="...">Settings</button> */}
            {/* Example: <button className="...">Logout</button> */}
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
         {/* Outlet renders the matched nested route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboardLayout;