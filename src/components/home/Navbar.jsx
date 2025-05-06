import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-[#eeeee4] shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Section: Logo and Links */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-gray-800">IgniteLearn</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="/Home/All" className="text-gray-600 hover:text-gray-800 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                Classes
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
                Support
              </a>
            </li>
            <li>
              <a href="/Home/About" className="text-gray-600 hover:text-gray-800 transition-colors">
                About us
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section: Sign in/Sign up */}
        <div className="flex space-x-3">
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Sign in
          </a>
          <a
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;