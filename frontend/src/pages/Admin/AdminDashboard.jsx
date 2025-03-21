import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [chartData, setChartData] = useState({
        options: {
            chart: { id: "user-role-chart" },
            xaxis: { categories: [] }
        },
        series: [{ name: "Users", data: [] }]
    });

    const [advertisementFile, setAdvertisementFile] = useState(null);

    // Handle Search Input
    useEffect(() => {
        if (users) {
            setFilteredUsers(
                users.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            // Generate Chart Data
            const roleCounts = users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            setChartData({
                options: { xaxis: { categories: Object.keys(roleCounts) } },
                series: [{ name: "Users", data: Object.values(roleCounts) }]
            });
        }
    }, [users, searchQuery]);

    const handleFileChange = (e) => {
        setAdvertisementFile(e.target.files[0]);
    };

    const handleUploadAdvertisement = () => {
        if (!advertisementFile) {
            alert("Please select an advertisement file.");
            return;
        }

        // Simulate file upload process
        console.log("Uploading advertisement:", advertisementFile);
        alert("Advertisement uploaded successfully!");
        setAdvertisementFile(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-[80px]">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error.message}</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Search Input */}
                    <div className="md:col-span-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Total Users Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Total Users</h2>
                        <p className="text-3xl font-bold">{filteredUsers.length}</p>
                    </div>

                    {/* User Role Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">User Roles</h2>
                        <Chart options={chartData.options} series={chartData.series} type="bar" height={300} />
                    </div>

                    {/* User List Table */}
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

                    {/* Connect to Support Page */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Support</h2>
                        <p className="mb-4">Need help? Contact support for assistance.</p>
                        <Link to="/support" className="text-blue-500 hover:text-blue-700">Go to Support Page</Link>
                    </div>

                    {/* Advertisement Upload Section */}
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
