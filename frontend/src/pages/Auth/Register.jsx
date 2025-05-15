import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate, useNavigation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader"
import { setCredientials } from "../../redux/features/auth/authSlice.js"
import { toast } from "react-toastify"
import { useRegisterMutation } from "../../redux/api/usersApiSlice.js"

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");
    const [alStream, setAlStream] = useState("");
    const [alYear, setAlYear] = useState(""); 

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();
    const {userInfo} = useSelector(state => state.auth);

    const {search} =useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if(userInfo) navigate(redirect)
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if(password != confirmPassword ) {
            toast.error("Passwords do not match.");
            return;
        } 
        if (!alYear || alYear < 2020) {
            toast.error("Please enter a valid A/L Year.");
            return;
          }
        else {
            try {
                const res = await register({username, email,alStream, alYear, password
                }).unwrap();

                dispatch(setCredientials({...res}))
                navigate(redirect)
                toast.success("User successfully registered.");
            } catch (error) {
                console.log(error);
                toast.error(error.data.message);
            }
        }
    };


  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 mt-20">
  <div className="bg-white shadow-lg rounded-lg p-8 w-[42rem]">
    <h1 className="text-3xl font-semibold text-center text-black mb-6">Register</h1>

    <form onSubmit={submitHandler} className="space-y-5">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          placeholder="Enter name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* A/L Stream */}
      <div>
        <label htmlFor="alStream" className="block text-sm font-medium text-gray-700">
          A/L Stream
        </label>
        <select
          id="alStream"
          className="mt-1 p-3 border rounded-lg w-full bg-white focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          value={alStream}
          onChange={(e) => setAlStream(e.target.value)}
          required
        >
          <option value="">Select Stream</option>
          <option value="Science">Bio Science</option>
          <option value="Mathematics">Physical Science</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
          <option value="Technology">Technology</option>
        </select>
      </div>

      {/* A/L Year */}
      <div>
        <label htmlFor="alYear" className="block text-sm font-medium text-gray-700">
          A/L Year
        </label>
        <input
          type="number"
          id="alYear"
          className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          placeholder="Enter A/L Year"
          value={alYear}
          onChange={(e) => setAlYear(e.target.value)}
          min="2020"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        disabled={isLoading}
        type="submit"
        className="w-full bg-[#1e81b0] text-white py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:bg-[#16658a] disabled:opacity-50"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      {isLoading && <Loader />}
    </form>

    {/* Already have an account? */}
    <div className="mt-6 text-center">
      <p className="text-gray-700">
        Already have an account?{" "}
        <Link
          to={redirect ? `/login?redirect=${redirect}` : "/login"}
          className="text-[#1e81b0] font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  </div>
</section>

  )

  
};

export default Register
