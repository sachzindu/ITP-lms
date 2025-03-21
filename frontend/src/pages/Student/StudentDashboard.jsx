import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <Link
            to="/profile"
            className="block py-2 px-4 bg-[#1e81b0] text-white rounded-lg hover:bg-[#156580] transition"
          >
            Update Profile
          </Link>
          <Link
            to="/student-courses"
            className="block py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            My Courses
          </Link>
          <Link
            to="/student-grades"
            className="block py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Grades
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your profile, courses, and grades all in one place.</p>
      </main>
    </div>
  );
};

export default StudentDashboard;
