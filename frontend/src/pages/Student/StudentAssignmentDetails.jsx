import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileText, User, Download, Edit, Trash2 } from 'lucide-react';
import { useLazyGetAssignmentDetailsQuery } from '../../redux/api/assignmentApiSlice';
import { useLazyGetUserDetailsQuery } from '../../redux/api/usersApiSlice';


const StudentAssignmentDetails = () => {
    const [getAssignments]=useLazyGetAssignmentDetailsQuery();
  const [assignmentInfo,setAssignmentInfo]=useState([]);
  const  {assignmentId} = useParams();
  const navigate = useNavigate();
    const [teacher,setTeacherName]=useState("");
     const [getUser]=useLazyGetUserDetailsQuery();




  

  useEffect(()=>{
  const fetchAssignments=  async ()=>{
        const result=await getAssignments(assignmentId).unwrap();
        if(result){
            setAssignmentInfo(result.assi);


        }
       



    }

    fetchAssignments();



  },[assignmentId,getAssignments])


  // Find the selected assignment
  const selectedAssignment = assignmentInfo;
  const { title: asiTitle = '', teacher: asiTeacher = '', lecDocument = {} } = selectedAssignment;
  const secUrl = lecDocument?.secure_url || '';

   useEffect(()=>{
  
      const fetchTeacher=async ()=>{
  
        const res=await getUser(selectedAssignment.createdBy).unwrap();
        if(res){
        setTeacherName(res.username);}
        
      }
  
      fetchTeacher();
  
  
  
    },[])
  

  const handleUploadClick = () => {
    navigate('/student/uploaddoc');
  };
  
  
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8">
      {/* Header with gradient background */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <h1 className="text-white text-2xl font-bold text-center">{asiTitle}</h1>
        </div>
      </div>

      {/* Assignment details */}
      <div className="p-6">
        <div className="space-y-5 mb-6">
          <div className="flex items-center">
            <FileText size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Assignment Title</p>
              <p className="font-medium text-gray-800">{asiTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Teacher</p>
              <p className="font-medium text-gray-800">{teacher}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Download size={20} className="text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Document</p>
              <a 
                href={secUrl} 
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Assignment
              </a>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentDetails;