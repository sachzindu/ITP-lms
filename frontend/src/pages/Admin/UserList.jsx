import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { 
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useCreateUserMutation,
    useUpdateUserVerificationStatusMutation,
} from "../../redux/api/usersApiSlice.js";
import Message from "../../components/Message.jsx";

const UserList = () => {
    const navigate = useNavigate();
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [createUser] = useCreateUserMutation();
    const [updateUserVerificationStatus] = useUpdateUserVerificationStatusMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserData, setEditableUserData] = useState({});

    const [newUser, setNewUser] = useState({
        username: "",
        fullName: "",
        email: "",
        alStream: "",
        alYear: "",
        password: "",
        role: "student"
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteUser(id);
                refetch();
            } catch (error) {
                toast.error(error.data.message || error.error);
            }
        }
    };

    const startEditing = (user) => {
        setEditableUserId(user._id);
        setEditableUserData({ ...user });
    };

    const cancelEditing = () => {
        setEditableUserId(null);
        setEditableUserData({});
    };

    const updateHandler = async (id) => {
        try {
            await updateUser({ userId: id, ...editableUserData });
            setEditableUserId(null);
            toast.success("User updated successfully!");
            refetch();
        } catch (error) {
            toast.error(error.data.message || error.error);
        }
    };

    const createUserHandler = async (e) => {
        e.preventDefault();
        console.log("Creating user with data:", newUser);
        
        // Validate required fields
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.fullName) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Validate AL Year is a number
        if (newUser.alYear && isNaN(newUser.alYear)) {
            toast.error("AL Year must be a number.");
            return;
        }

        // Validate role-specific fields
        if (newUser.role === "student" && (!newUser.alStream || !newUser.alYear)) {
            toast.error("AL Stream and AL Year are required for students.");
            return;
        }

        if (newUser.role === "instructor" && !newUser.alStream) {
            toast.error("AL Stream is required for instructors.");
            return;
        }

        try {
            console.log("Preparing user data for submission...");
            const userData = {
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                alStream: newUser.role === "admin" ? null : newUser.alStream,
                alYear: newUser.role === "admin" ? null : newUser.alYear,
                address: newUser.address || "",
                contactNo: newUser.contactNo || "",
                profilePicture: "default-profile.png",
                isAccountVerified: true
            };
            console.log("Submitting user data:", userData);

            const response = await createUser(userData).unwrap();
            console.log("Server response:", response);
            
            if (response && response._id) {
                toast.success("User created successfully!");
                setNewUser({ 
                    username: "", 
                    fullName: "", 
                    email: "", 
                    alStream: "", 
                    alYear: "", 
                    password: "", 
                    role: "student",
                    address: "",
                    contactNo: ""
                });
                refetch();
            } else {
                console.error("Invalid response format:", response);
                toast.error("Failed to create user: Invalid response from server");
            }
        } catch (error) {
            console.error("Detailed error information:", {
                error,
                message: error.message,
                data: error.data,
                status: error.status,
                originalStatus: error.originalStatus
            });
            
            if (error.data?.message) {
                toast.error(`Error: ${error.data.message}`);
            } else if (error.error) {
                toast.error(`Error: ${error.error}`);
            } else if (error.message) {
                toast.error(`Error: ${error.message}`);
            } else {
                toast.error("Failed to create user. Please try again.");
            }
        }
    };

    const handleVerificationStatusChange = async (userId, newStatus) => {
        try {
            await updateUserVerificationStatus({
                userId,
                isAccountVerified: newStatus
            }).unwrap();
            toast.success("Verification status updated successfully");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update verification status");
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center gap-2 bg-[#1e81b0] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-semibold text-center">Users</h1>
                <div className="w-32"></div> {/* Spacer for alignment */}
            </div>

            {/* User Creation Form */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-100 shadow-md">
                <h2 className="text-xl font-semibold mb-3 text-center">Create User</h2>
                <form onSubmit={createUserHandler} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Username *"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name *"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email *"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password *"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => {
                            setNewUser({ 
                                ...newUser, 
                                role: e.target.value,
                                alStream: e.target.value === "admin" ? "" : newUser.alStream,
                                alYear: e.target.value === "admin" ? "" : newUser.alYear
                            });
                        }}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                    >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </select>
                    {newUser.role !== "admin" && (
                        <select
                            value={newUser.alStream}
                            onChange={(e) => setNewUser({ ...newUser, alStream: e.target.value })}
                            className="p-2 border rounded-lg focus:outline-blue-500"
                            required={newUser.role !== "admin"}
                        >
                            <option value="">Select AL Stream</option>
                            <option value="Science">Bio Science</option>
                            <option value="Mathematics">Physical Science</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Arts">Arts</option>
                            <option value="Technology">Technology</option>
                        </select>
                    )}
                    {newUser.role === "student" && (
                        <input
                            type="number"
                            placeholder="AL Year *"
                            value={newUser.alYear}
                            onChange={(e) => setNewUser({ ...newUser, alYear: e.target.value })}
                            className="p-2 border rounded-lg focus:outline-blue-500"
                            required
                        />
                    )}
                    <button 
                        type="submit" 
                        className="col-span-1 md:col-span-2 bg-[#1e81b0] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition">
                        <FaUserPlus /> Add User
                    </button>
                </form>
            </div>

            {/* User List Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Full Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">AL Stream</th>
                            <th className="px-4 py-2 border">AL Year</th>
                            <th className="px-4 py-2 border">Address</th>
                            <th className="px-4 py-2 border">Contact No</th>
                            <th className="px-4 py-2 border">Verification Status</th>
                            <th className="px-4 py-2 border">Join Date</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="11" className="text-center py-4">
                                    <Loader />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="11" className="text-center py-4 text-red-500">
                                    <Message variant="danger">{error.data?.message || error.error}</Message>
                                </td>
                            </tr>
                        ) : users?.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center py-4">
                                    <Message>No users found</Message>
                                </td>
                            </tr>
                        ) : (
                            users?.map((user) => (
                                <tr key={user._id} className="border hover:bg-gray-50">
                                    {editableUserId === user._id ? (
                                        <>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    value={editableUserData.username}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, username: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    value={editableUserData.fullName}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, fullName: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="email"
                                                    value={editableUserData.email}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, email: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <select
                                                    value={editableUserData.role}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, role: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="instructor">Instructor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <select
                                                    value={editableUserData.alStream}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, alStream: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                    disabled={editableUserData.role === "admin"}
                                                >
                                                    <option value="">Select Stream</option>
                                                    <option value="Science">Bio Science</option>
                                                    <option value="Mathematics">Physical Science</option>
                                                    <option value="Commerce">Commerce</option>
                                                    <option value="Arts">Arts</option>
                                                    <option value="Technology">Technology</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="number"
                                                    value={editableUserData.alYear}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, alYear: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                    disabled={editableUserData.role !== "student"}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    value={editableUserData.address}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, address: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    value={editableUserData.contactNo}
                                                    onChange={(e) => setEditableUserData({ ...editableUserData, contactNo: e.target.value })}
                                                    className="w-full p-1 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <select
                                                    value={editableUserData.isAccountVerified}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value === "true";
                                                        setEditableUserData({ ...editableUserData, isAccountVerified: newStatus });
                                                        handleVerificationStatusChange(user._id, newStatus);
                                                    }}
                                                    className="w-full p-1 border rounded"
                                                >
                                                    <option value="true">Verified</option>
                                                    <option value="false">Not Verified</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => updateHandler(user._id)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2 border">{user.username}</td>
                                            <td className="px-4 py-2 border">{user.fullName}</td>
                                            <td className="px-4 py-2 border">{user.email}</td>
                                            <td className="px-4 py-2 border capitalize">{user.role}</td>
                                            <td className="px-4 py-2 border">{user.alStream || "N/A"}</td>
                                            <td className="px-4 py-2 border">{user.alYear || "N/A"}</td>
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
                                            <td className="px-4 py-2 border">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(user._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
