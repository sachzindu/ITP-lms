import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaDownload, FaUsers, FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaUserCog, FaList } from "react-icons/fa";

function AdminDashboard() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState({
        students: [],
        instructors: [],
        admins: []
    });

    const [userCounts, setUserCounts] = useState({
        total: 0,
        students: 0,
        instructors: 0,
        admins: 0
    });

    const [chartData, setChartData] = useState({
        options: {
            chart: { id: "user-role-chart" },
            xaxis: { categories: [] }
        },
        series: [{ name: "Users", data: [] }]
    });

    const [advertisementFile, setAdvertisementFile] = useState(null);

    // Handle Search Input and Filter Users
    useEffect(() => {
        if (users) {
            console.log("Raw users data:", users); // Debug log to see the raw data
            const filtered = {
                students: users.filter(user => 
                    user.role === "student" && (
                        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.alStream?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.contactNo?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                ),
                instructors: users.filter(user => 
                    user.role === "instructor" && (
                        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.alStream?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.contactNo?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                ),
                admins: users.filter(user => 
                    user.role === "admin" && (
                        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.contactNo?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                )
            };
            console.log("Filtered users:", filtered); // Debug log to see the filtered data
            setFilteredUsers(filtered);

            // Update user counts
            setUserCounts({
                total: users.length,
                students: users.filter(user => user.role === "student").length,
                instructors: users.filter(user => user.role === "instructor").length,
                admins: users.filter(user => user.role === "admin").length
            });

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

    const downloadUserReport = (users, role) => {
        const headers = {
            student: "Full Name,Username,Email,AL Stream,AL Year,Address,Contact No,Enrolled Classes,Profile Picture,Verification Status,Join Date",
            instructor: "Full Name,Username,Email,AL Stream,Address,Contact No,Profile Picture,Verification Status,Join Date",
            admin: "Full Name,Username,Email,Address,Contact No,Profile Picture,Verification Status,Join Date"
        };

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers[role] + "\n"
            + users.map(user => {
                const row = [
                    user.fullName,
                    user.username,
                    user.email,
                    ...(role === "student" ? [user.alStream, user.alYear] : []),
                    ...(role === "instructor" ? [user.alStream] : []),
                    user.address || "N/A",
                    user.contactNo || "N/A",
                    ...(role === "student" ? [user.enrolledClasses?.length || 0] : []),
                    user.profilePicture || "default-profile.png",
                    user.isAccountVerified ? "Verified" : "Not Verified",
                    new Date(user.createdAt).toLocaleDateString()
                ];
                return row.join(",");
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${role}s_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderUserTable = (users, role) => {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold capitalize">{role}s ({users.length})</h2>
                    <button
                        onClick={() => downloadUserReport(users, role)}
                        className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                        <FaDownload /> Download {role}s Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Username</th>
                                <th className="px-4 py-2 border">Full Name</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Role</th>
                                {role === "student" && (
                                    <>
                                        <th className="px-4 py-2 border">AL Stream</th>
                                        <th className="px-4 py-2 border">AL Year</th>
                                        <th className="px-4 py-2 border">Enrolled Classes</th>
                                    </>
                                )}
                                {role === "instructor" && (
                                    <th className="px-4 py-2 border">AL Stream</th>
                                )}
                                <th className="px-4 py-2 border">Address</th>
                                <th className="px-4 py-2 border">Contact No</th>
                                <th className="px-4 py-2 border">Verification Status</th>
                                <th className="px-4 py-2 border">Join Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => {
                                    console.log("User data:", user); // Debug log to see the user data
                                    return (
                                        <tr key={user._id} className="border hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{user.username || "N/A"}</td>
                                            <td className="px-4 py-2 border">{user.fullName || "N/A"}</td>
                                            <td className="px-4 py-2 border">{user.email || "N/A"}</td>
                                            <td className="px-4 py-2 border capitalize">{user.role || "N/A"}</td>
                                            {role === "student" && (
                                                <>
                                                    <td className="px-4 py-2 border">{user.alStream || "N/A"}</td>
                                                    <td className="px-4 py-2 border">{user.alYear || "N/A"}</td>
                                                    <td className="px-4 py-2 border">{user.enrolledClasses?.length || 0}</td>
                                                </>
                                            )}
                                            {role === "instructor" && (
                                                <td className="px-4 py-2 border">{user.alStream || "N/A"}</td>
                                            )}
                                            <td className="px-4 py-2 border">{user.address || "N/A"}</td>
                                            <td className="px-4 py-2 border">{user.contactNo || "N/A"}</td>
                                            <td className="px-4 py-2 border">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.isAccountVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                    {user.isAccountVerified ? "Verified" : "Not Verified"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={role === "student" ? 11 : role === "instructor" ? 10 : 9} 
                                        className="text-center py-4">
                                        No {role}s found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-[80px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-center md:text-left">Admin Dashboard</h1>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link 
                        to="/admin/userlist" 
                        className="flex items-center gap-2 bg-[#1e81b0] text-white py-2 px-4 rounded-lg hover:bg-[#156580] transition"
                    >
                        <FaList /> User Management
                    </Link>
                    <Link 
                        to="/profile" 
                        className="flex items-center gap-2 bg-[#1e81b0] text-white py-2 px-4 rounded-lg hover:bg-[#156580] transition"
                    >
                        <FaUserCog /> My Profile
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error.message}</p>
            ) : (
                <div className="space-y-6">
                    {/* User Count Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Users Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Users</p>
                                    <h3 className="text-2xl font-bold">{userCounts.total}</h3>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FaUsers className="text-blue-500 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Students Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Students</p>
                                    <h3 className="text-2xl font-bold">{userCounts.students}</h3>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <FaUserGraduate className="text-green-500 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Instructors Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Instructors</p>
                                    <h3 className="text-2xl font-bold">{userCounts.instructors}</h3>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <FaChalkboardTeacher className="text-purple-500 text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Admins Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Admins</p>
                                    <h3 className="text-2xl font-bold">{userCounts.admins}</h3>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full">
                                    <FaUserShield className="text-red-500 text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search by username, email, stream, address, or contact..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
                        />
                    </div>

                    {/* User Role Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
                        <Chart options={chartData.options} series={chartData.series} type="bar" height={300} />
                    </div>

                    {/* User Tables */}
                    <div className="grid grid-cols-1 gap-6">
                        {renderUserTable(filteredUsers.students, "student")}
                        {renderUserTable(filteredUsers.instructors, "instructor")}
                        {renderUserTable(filteredUsers.admins, "admin")}
                    </div>

                 
                   
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
