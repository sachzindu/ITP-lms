import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../redux/api/usersApiSlice.js';
import { setCredientials } from '../../redux/features/auth/authSlice.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect');

    useEffect(() => {
        if (userInfo) {
            // Redirect based on user role
            switch (userInfo.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'instructor':
                    navigate('/instructor/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                default:
                    navigate(redirect || '/');
            }
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredientials({ ...res }));
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <section className="bg-white shadow-lg rounded-lg p-8 w-[40rem]">
                <h1 className="text-3xl font-semibold text-center text-black mb-6">Sign In</h1>

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#1e81b0] focus:border-[#1e81b0] outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-[#1e81b0] hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        disabled={isLoading} 
                        type="submit" 
                        className="w-full bg-[#1e81b0] text-white py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:bg-[#16658a] disabled:opacity-50"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>

                    {isLoading && <Loader />}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-700">
                        New Customer?{" "}
                        <Link 
                            to={redirect ? `/register?redirect=${redirect}` : "/register"} 
                            className="text-[#1e81b0] font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Login;
