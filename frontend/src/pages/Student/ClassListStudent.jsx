import { useState } from 'react';
import { BookOpen, GraduationCap, User, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data for enrolled courses
  const [courses] = useState([
    
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Learner</h2>
        <nav className="space-y-3">
          <a
            href="/profile"
            className="flex items-center py-2 px-4 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <User size={18} className="mr-3" />
            <span>Profile</span>
          </a>
          <a
            href="/student-courses"
            className="flex items-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <BookOpen size={18} className="mr-3" />
            <span>My Courses</span>
          </a>
          <a
            href="/student-grades"
            className="flex items-center py-2 px-4 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <GraduationCap size={18} className="mr-3" />
            <span>Grades</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue learning from where you left off</p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300 h-full flex flex-col">
              <div className="relative">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>
                
                {/* Progress bar */}
                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  
                  <button className="mt-4 w-full py-2 flex justify-center items-center text-blue-600 hover:text-blue-800 font-medium transition">
                    Continue Learning
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
