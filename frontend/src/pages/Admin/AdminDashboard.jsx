// Import required libraries and hooks
import Chart from "react-apexcharts"; // ApexCharts for chart visualization
import { useGetUsersQuery } from "../../redux/api/usersApiSlice"; // RTK Query hook to fetch users
import { useState, useEffect } from "react"; // React hooks
import { Link } from "react-router-dom"; // For internal navigation

function AdminDashboard() {
    // Destructure the query result: users data, loading state, and error
    const { data: users, isLoading, error } = useGetUsersQuery();
    
    // State to hold the search input
    const [searchQuery, setSearchQuery] = useState("");

    // State to hold filtered users based on search
    const [filteredUsers, setFilteredUsers] = useState([]);

    // State for chart data, with initial dummy config
    const [chartData, setChartData] = useState({
        options: {
            chart: { id: "user-role-chart" },
            xaxis: { categories: [] }
        },
        series: [{ name: "Users", data: [] }]
    });

    // State to store the selected advertisement file
    const [advertisementFile, setAdvertisementFile] = useState(null);

    // useEffect triggers when users or searchQuery changes
    useEffect(() => {
        if (users) {
            // Filter users by username, email, or role (case-insensitive)
            setFilteredUsers(
                users.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            // Generate data for the chart (user count by role)
            const roleCounts = users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            // Update chart data with roles and their respective user counts
            setChartData({
                options: { xaxis: { categories: Object.keys(roleCounts) } },
                series: [{ name: "Users", data: Object.values(roleCounts) }]
            });
        }
    }, [users, searchQuery]);

    // Handle advertisement file selection
    const handleFileChange = (e) => {
        setAdvertisementFile(e.target.files[0]);
    };

    // Handle advertisement file upload (simulated)
    const handleUploadAdvertisement = () => {
        if (!advertisementFile) {
            alert("Please select an advertisement file.");
            return;
        }

        // Simulate upload (you can replace this with actual upload logic)
        console.log("Uploading advertisement:", advertisementFile);
        alert("Advertisement uploaded successfully!");
        setAdvertisementFile(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-[80px]">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

            {/* Show loading, error or main content */}
            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error.message}</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Search Input Box */}
                    <div className="md:col-span-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Card showing total number of filtered users */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Total Users</h2>
                        <p className="text-3xl font-bold">{filteredUsers.length}</p>
                    </div>

                    {/* Bar chart showing distribution of users by role */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">User Roles</h2>
                        <Chart 
                            options={chartData.options} 
                            series={chartData.series} 
                            type="bar" 
                            height={300} 
                        />
                    </div>

                    {/* Table displaying list of filtered users */}
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                        <h2 className="text-xl font-semibold mb-2">Users List</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user._id} className="border">
                                            <td className="px-4 py-2 border text-center">{user._id}</td>
                                            <td className="px-4 py-2 border">{user.username}</td>
                                            <td className="px-4 py-2 border">{user.email}</td>
                                            <td className="px-4 py-2 border">{user.role}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Support Section with link to support page */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Support</h2>
                        <p className="mb-4">Need help? Contact support for assistance.</p>
                        <Link to="/support" className="text-blue-500 hover:text-blue-700">
                            Go to Support Page
                        </Link>
                    </div>

                    {/* Advertisement upload section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Upload Advertisement</h2>
                        <input
                            type="file"
                            accept="image/*, .pdf"
                            onChange={handleFileChange}
                            className="mb-4 p-2 border rounded-lg"
                        />
                        <button
                            onClick={handleUploadAdvertisement}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                        >
                            Upload Advertisement
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
