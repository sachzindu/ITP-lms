import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredientials } from "../../redux/features/auth/authSlice.js";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice.js";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, username, email, password }).unwrap();
        dispatch(setCredientials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 mt-16 max-w-lg">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Profile</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-pink-200 focus:outline-none"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-[#1e81b0] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-[#1e81b0] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-[#1e81b0] focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-[#1e81b0] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#1e81b0] transition">
              Update
            </button>
            <Link
              to="/user-orders"
              className="bg-gray-100 text-[#1e81b0] font-semibold py-2 px-6 rounded-lg hover:bg-pink-50 transition">
              My Classes
            </Link>
          </div>
        </form>

        {loadingUpdateProfile && (
          <div className="mt-6">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
