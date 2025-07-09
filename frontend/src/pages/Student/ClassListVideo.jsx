import { useEffect, useState } from 'react';
import { useLazyGetEnrolledClassesByUserIdQuery } from '../../redux/api/usersApiSlice';
import { useSelector } from 'react-redux';
import { useLazyGetClassesByClassIdQuery } from '../../redux/api/classesApiSlice';
import { Link, useNavigate } from 'react-router';

const ClassListVideo = () => {
  const [getEnrolledClasses] = useLazyGetEnrolledClassesByUserIdQuery();
  const { userInfo } = useSelector(state => state.auth);
  const [getClassesById] = useLazyGetClassesByClassIdQuery();
  const navigate=useNavigate();
  
  // Use state for classIds instead of a regular variable
  const [classIds, setClassIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with empty array but keep the placeholder structure
  const [items, setItems] = useState([
   
  ]);

  // First useEffect to fetch enrolled class IDs
  useEffect(() => {
    const fetchEnrolledClassIds = async () => {
      try {
        setIsLoading(true);
        const enrolledClasses = await getEnrolledClasses(userInfo._id).unwrap();
        if (enrolledClasses && enrolledClasses.length > 0) {
          console.log("Enrolled class ids fetched successfully", enrolledClasses);
          setClassIds(enrolledClasses);
        }
      } catch (error) {
        console.error("Error fetching enrolled classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo && userInfo._id) {
      fetchEnrolledClassIds();
    }
  }, [userInfo, getEnrolledClasses]);

  // Second useEffect to fetch class details using the IDs
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classIds || classIds.length === 0) return;
      
      try {
        setIsLoading(true);
        const fetchedClasses = await getClassesById(classIds).unwrap();
        if (fetchedClasses && fetchedClasses.length > 0) {
          console.log("Enrolled classes fetched successfully", fetchedClasses);
          setItems(fetchedClasses); // Replace the items with fetched classes
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [classIds, getClassesById]);

  const handleClick=(id)=>{
    
    navigate(`/student/videolistview/${id}`);



  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Classes</h1>
      {isLoading ? (
        <div className="text-center py-8">Loading your classes...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item._id} 
              id={item?._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              onClick={()=>handleClick(item._id)}
            >
              <div className="relative h-48 w-full">
                <img 
                  src={item?.thumbnail?.secure_url || item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassListVideo