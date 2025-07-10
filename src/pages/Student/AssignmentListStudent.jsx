import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLazyGetAssignmentsByClassIdQuery } from '../../redux/api/assignmentApiSlice'; // Adjust path if needed

const AssignmentItem = ({ assignment, onClick }) => {
  return (
    <div 
      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
      onClick={() => onClick(`/student/assignment/upload/${assignment._id}`)}
    >
      <div>
        <h3 className="font-medium text-lg text-gray-800">{assignment.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
       
      </div>
      <div className="text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

const AssignmentListStudent = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [assignmentsData, setAssignmentsData] = useState([]);

  const [getAssignments, { isLoading, isError, error }] = useLazyGetAssignmentsByClassIdQuery();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!classId) return;
      try {
        const result = await getAssignments(classId).unwrap();
        setAssignmentsData(result.assignments);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, [classId, getAssignments]);

  const handleClick = (link) => navigate(link);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Loading assignments...
        </h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border rounded-lg">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Error loading assignments
        </h1>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error?.data?.message || "Failed to load assignments. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Assignments available for the class
      </h1>

      {assignmentsData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No assignments available for this class yet.
        </div>
      ) : (
        <div className="space-y-4">
          {assignmentsData.map((assignment) => (
            <AssignmentItem
              key={assignment._id}
              assignment={assignment}
              onClick={handleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentListStudent;
