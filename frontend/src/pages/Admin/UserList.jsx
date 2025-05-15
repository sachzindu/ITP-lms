import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUserPlus } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { 
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useCreateUserMutation,
} from "../../redux/api/usersApiSlice.js";
import Message from "../../components/Message.jsx";

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [createUser] = useCreateUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserData, setEditableUserData] = useState({});

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        alStream: "",
        alYear: "",
        password: "",
        role: "",
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
        console.log("Creating user:", newUser);
        if (!newUser.username || !newUser.email || !newUser.password) {
            toast.error("Please fill in all required fields.");
            return;
        }
        try {
            await createUser(newUser);
            toast.success("User created successfully!");
            setNewUser({ username: "", email: "", alStream: "", alYear: "", password: "", role: "" });
            refetch();
        } catch (error) {
            toast.error(error.data.message || error.error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">Users</h1>

            {/* User Creation Form */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-100 shadow-md">
                <h2 className="text-xl font-semibold mb-3 text-center">Create User</h2>
                <form onSubmit={createUserHandler} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="AL Stream"
                        value={newUser.alStream}
                        onChange={(e) => setNewUser({ ...newUser, alStream: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="AL Year"
                        value={newUser.alYear}
                        onChange={(e) => setNewUser({ ...newUser, alYear: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="p-2 border rounded-lg focus:outline-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="col-span-1 md:col-span-2 bg-[#1e81b0] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition">
                        <FaUserPlus /> Add User
                    </button>
                </form>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data.message || error.message}</Message>
            ) : (
                <div className="overflow-x-auto py-6">
                    <div className="shadow-lg rounded-xl bg-white p-6">
                        <table className="min-w-full table-auto border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#1e81b0] to-[#74c8e7] text-white">
                                    <th className="px-6 py-3 text-center border-b font-semibold">ID</th>
                                    <th className="px-6 py-3 text-left border-b font-semibold">NAME</th>
                                    <th className="px-6 py-3 text-left border-b font-semibold">EMAIL</th>
                                    <th className="px-6 py-3 text-left border-b font-semibold">AL STREAM</th>
                                    <th className="px-6 py-3 text-left border-b font-semibold">AL YEAR</th>
                                    <th className="px-6 py-3 text-left border-b font-semibold">ROLE</th>
                                    <th className="px-6 py-3 text-center border-b font-semibold">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 text-center text-gray-800">{user._id}</td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {editableUserId === user._id ? (
                                                    <input
                                                        type="text"
                                                        value={editableUserData.username}
                                                        onChange={(e) => setEditableUserData({ ...editableUserData, username: e.target.value })}
                                                        className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#1e81b0] transition"
                                                    />
                                                ) : (
                                                    user.username
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {editableUserId === user._id ? (
                                                    <input
                                                        type="email"
                                                        value={editableUserData.email}
                                                        onChange={(e) => setEditableUserData({ ...editableUserData, email: e.target.value })}
                                                        className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#1e81b0] transition"
                                                    />
                                                ) : (
                                                    user.email
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {editableUserId === user._id ? (
                                                    <input
                                                        type="text"
                                                        value={editableUserData.alStream}
                                                        onChange={(e) => setEditableUserData({ ...editableUserData, alStream: e.target.value })}
                                                        className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#1e81b0] transition"
                                                    />
                                                ) : (
                                                    user.alStream
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {editableUserId === user._id ? (
                                                    <input
                                                        type="text"
                                                        value={editableUserData.alYear}
                                                        onChange={(e) => setEditableUserData({ ...editableUserData, alYear: e.target.value })}
                                                        className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#1e81b0] transition"
                                                    />
                                                ) : (
                                                    user.alYear
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {editableUserId === user._id ? (
                                                    <input
                                                        type="text"
                                                        value={editableUserData.role}
                                                        onChange={(e) => setEditableUserData({ ...editableUserData, role: e.target.value })}
                                                        className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#1e81b0] transition"
                                                    />
                                                ) : (
                                                    user.role
                                                )}
                                            </td>
                                            {/* Action Buttons */}
                                            <td className="px-6 py-4 text-center">
                                                {editableUserId === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateHandler(user._id)}
                                                            className="ml-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow-md transition"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md shadow-md transition"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}
                                            
                                                {!user.role.includes("admin") && (
                                                    <button
                                                        onClick={() => deleteHandler(user._id)}
                                                        className="ml-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md transition"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-600">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
