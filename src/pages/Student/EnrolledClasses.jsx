import { useState } from 'react';
import { useLazyGetEnrolledClassesByUserIdQuery } from '../../redux/api/usersApiSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLazyGetClassesByClassIdQuery } from '../../redux/api/classesApiSlice';

// Sample data - replace with your actual data
const initialClasses = [
  
];

export default function EnrolledClasses() {
  const [classes,setClasses] = useState(initialClasses);
  const [classIds,setClassIds] = useState([]);
  
  const [getEnrolledClasses]=useLazyGetEnrolledClassesByUserIdQuery();
  const {userInfo}=useSelector(state=>state.auth);
  const [getClasses]=useLazyGetClassesByClassIdQuery();


  useEffect(()=>{

    const getUserClasses=async ()=>{
        const res=await getEnrolledClasses(userInfo._id).unwrap();
        if(res){
            setClassIds(res);
        }
    }
    getUserClasses();



  },[getEnrolledClasses,userInfo])

  useEffect(()=>{

    const getClass=async ()=>{
        const res=await getClasses(classIds).unwrap();
        if(res){
            setClasses(res);
        }
    }

    getClass();
 



  },[getClasses,classIds])

  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Enrolled Classes</h2>
        <div className="w-24 h-1 bg-indigo-600 mx-auto rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map((course) => (
          <div 
            key={course._id} 
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-xl"
          >
            <div className="relative">
              <img 
                src={course?.thumbnail?.secure_url} 
                alt={course?.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                Active
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course?.title}</h3>
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
