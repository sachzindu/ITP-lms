import { useSelector } from 'react-redux';
import React, {useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Seeclassdetails = () => {
  const {courseInfo}=useSelector(state=>state.course);
  const {classIdInfo}=useSelector(state=>state.classId);
 
 
  
  const navigate = useNavigate();

  let clzTitle = '';
  let clzTeacher = '';
  let secUrl = '';
  let uid=classIdInfo;

  const handleClick=()=>{
    navigate('/student/addstudent');
  }

 

  courseInfo.forEach((item) => {
    if (item._id == uid) {
      clzTitle = item.title;
      clzTeacher = item.teacher;
      secUrl = item.thumbnail.secure_url;
    }
  });


  
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8 transition-all duration-300 hover:shadow-xl">
      {/* Header image with gradient overlay and text */}
      <div className="relative h-56">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-indigo-900/90 mix-blend-multiply" />
        <img 
          src={secUrl} 
          alt="Class cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <h1 className="text-white text-3xl font-bold text-center drop-shadow-md">{clzTitle}</h1>
          <div className="mt-2 px-4 py-1 bg-amber-500 rounded-full">
            <p className="text-white text-sm font-medium">Premium Class</p>
          </div>
        </div>
      </div>

      {/* Class details container */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .137.112.25.25.25h.5a.25.25 0 00.25-.25v-.5a.249.249 0 01.25-.25h1.5a.249.249 0 01.25.25v.5a.25.25 0 00.25.25h.5a.25.25 0 00.25-.25v-.5a.249.249 0 01.25-.25h1.5a.25.25 0 01.25.25v.5a.25.25 0 00.25.25h.5a.25.25 0 00.25-.25v-1.069l2.078-.885a1 1 0 00.575-.906v-.503a1 1 0 00-.575-.906l-6.5-2.786zM7.5 11.5V10h1v1.5a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5zm4 0V10h1v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5z" />
            </svg>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Course Title</p>
              <p className="font-medium text-gray-800">{clzTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-medium text-gray-800">{clzTeacher}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tuition Fee</p>
              <p className="font-medium text-gray-800">Rs 3,500.00</p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
            onClick={handleClick} >
            Enroll
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Seeclassdetails;