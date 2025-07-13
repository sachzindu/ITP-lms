import { useState, useEffect } from "react";
import { 
    AiOutlineHome,
    AiOutlineShopping,
    AiOutlineLogin,
    AiOutlineUserAdd,
    AiOutlineShoppingCart 
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
    const { userInfo } = useSelector(state => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDashboardRedirect = () => {
        if (userInfo?.role === "admin") {
            navigate("/admin/dashboard");
        } else if (userInfo?.role === "student") {
            navigate("/student/dashboard");
        } else if (userInfo?.role === "instructor") {
            navigate("/instructor/dashboard");
        } else {
            navigate("/profile"); // Fallback to profile if role is undefined
        }
    };
   

    useEffect(() => {
        if (userInfo) {
            handleDashboardRedirect();
        }
    }, [userInfo, navigate]);



    return (
        <div id="navigation-container" className="w-screen h-[80px] z-10 bg-gradient-to-r from-indigo-600 to-blue-500 text-white sticky top-0 left-0 flex justify-between items-center px-6 py-6 shadow-md my-0 mx-0">
         <div className="px-2 flex justify-between items-center w-full h-full">
            <div className="flex space-x-8">
              <h1 className="text-3xl font-bold mr-4 sm:text-4xl">IgniteLearn</h1>
              <ul className="flex space-x-6">
                <li className="px-4 py-4"><Link to="/home" className="flex items-center space-x-2 text-black hover:text-gray-200">
                    <span>Home</span>
                </Link></li>
               
                <li className="px-4 py-4"><Link to="/ticket" className="flex items-center space-x-2 text-black hover:text-gray-200">
                    <span>Support</span>
                </Link></li>
                <li className="px-4 py-4"><Link to="/about" className="flex items-center space-x-2 text-black hover:text-gray-200">
                    <span>About Us</span>
                </Link></li>
                </ul>
            </div>

            <div>
                {userInfo ? (
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-black flex items-center space-x-2">
                            <span>{userInfo.username}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <ul className="absolute right-2 mt-2 bg-white text-black p-2 shadow-lg rounded-md">
                                {userInfo.role === "admin" && (
                                    <>
                                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                                        <li><Link to="/admin/categorylist">Category</Link></li>
                                        <li><Link to="/admin/userlist">Users</Link></li>
                                    </>
                                )}
                               
                               {userInfo.role === "student" && (
                                    <>
                                        <li><Link to="/student/dashboard">Dashboard</Link></li>
                                        
                                    </>
                                )}
                                {userInfo.role === "instructor" && (
                                    <>
                                        <li><Link to="/instructor/dashboard">Dashboard</Link></li>
                                        
                                    </>
                                )}
                                <li><Link to="/profile">Profile</Link></li>
                            

                                <li><button onClick={logoutHandler}>Logout</button></li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="flex space-x-6">
                        <Link to="/login" className="flex items-center space-x-2 text-black hover:text-gray-200">
                            <AiOutlineLogin size={26} />
                            <span>Login</span>
                        </Link>
                        <Link to="/register" className="flex items-center space-x-2 text-black hover:text-gray-200">
                            <AiOutlineUserAdd size={26} />
                            <span>Register</span>
                        </Link>
                    </div>
                )}
            </div>
          </div>
        </div>
        
    );
};

export default Navigation;
