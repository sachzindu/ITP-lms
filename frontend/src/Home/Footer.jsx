import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-3 text-sm">
          {/* Column 1 */}
          <div>
            <h6 className="font-bold uppercase mb-2">A/L Batches</h6>
            <ul className="space-y-1">
              <li>2025 A/L</li>
              <li>2026 A/L</li>
              <li>2027 A/L</li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h6 className="font-bold uppercase mb-2">Streams</h6>
            <ul className="space-y-1">
              <li>Maths</li>
              <li>Bio Sciences</li>
              <li>Commerce</li>
              <li>Technology</li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h6 className="font-bold uppercase mb-2">Institution</h6>
            <ul className="space-y-1">
              <li>About</li>
              <li>Blog</li>
              <li>Mission</li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h6 className="font-bold uppercase mb-2">Legal</h6>
            <ul className="space-y-1">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Policies</li>
            </ul>
          </div>
          
          {/* Column 5 - Contact */}
          <div className="col-span-2 md:col-span-1">
            <h6 className="font-bold uppercase mb-2">Feedback</h6>
            <div className="flex items-center mt-2">
              <input 
                className="w-full p-2 rounded-l-md text-gray-800 text-sm" 
                type="email" 
                placeholder="Your message..."
              />
              <button className="bg-white text-indigo-600 p-2 rounded-r-md font-medium hover:bg-gray-100">
                Send
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-indigo-400 text-sm">
          <p className="mb-2 sm:mb-0">© 2025 IgniteLearn</p>
          <div className="flex space-x-6">
            <FaFacebook className="hover:text-blue-200 cursor-pointer" />
            <FaInstagram className="hover:text-blue-200 cursor-pointer" />
            <FaTwitter className="hover:text-blue-200 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;