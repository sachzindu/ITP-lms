import { useEffect, useState } from "react";
import { Users, MessageCircle, BookOpen, Grid, ArrowRight } from "lucide-react";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useLazyGetTicketsQuery } from "../../redux/api/supportApiSlice";
import { useLazyGetLecsQuery } from "../../redux/api/lecsApiSlice";
import { useLazyGetClassesQuery } from "../../redux/api/classesApiSlice";
import { useLazyGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const {data, error, isLoading} = useGetUsersQuery();
  const [getTickets] = useLazyGetTicketsQuery();
  const [getLecs] = useLazyGetLecsQuery();
  const [getClasses] = useLazyGetClassesQuery();
  const [getUsers] = useLazyGetUsersQuery();
  const [tickets, setTickets] = useState([]);
  const [lecs, setLecs] = useState([]);
  const [clzes, setClzes] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate =useNavigate();

  useEffect(() => {
    const gTickets = async () => {
      try {
        const resObj = await getTickets().unwrap();
        if (resObj) {
          setTickets(resObj.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const gUsers = async () => {
      try {
        const resObj = await getUsers().unwrap();
        if (resObj) {
          setUsers(resObj);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    const sLecs = async () => {
      try {
        const resObj = await getLecs().unwrap();
        setLecs(resObj.lec);
      } catch (error) {
        console.log(error);
      }
    }
  
    const gClasses = async () => {
      try {
        const resObj = await getClasses().unwrap();
        setClzes(resObj.data);
      } catch (error) {
        console.log(error);
      }
    }

    gTickets();
    sLecs();
    gClasses();
    gUsers();
  }, []);

  // Card data with only total counts
  const dashboardData = {
    users: users?.length || 0,
    support: tickets?.length || 0,
    lectures: lecs?.length || 0,
    classes: clzes?.length || 0
  };

  // Navigation handler (would integrate with your routing system)
  const handleNavigate = (subsystem) => {
    if (subsystem=="classes"){
      navigate('/admin/allclasses');
    }else if(subsystem=="support"){
      navigate('/admin/supportadmin');

    }else if(subsystem=="lectures"){
      navigate('/admin/classlistlec');


    }else if(subsystem=="users"){
      navigate('/admin/userdashboard');

    }
   
  };

  // Card component for reusability
  const DashboardCard = ({ title, icon, total, color, subsystem }) => {
    const Icon = icon;
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className={`p-5 border-b ${color}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <Icon className="text-gray-600" size={20} />
          </div>
        </div>
        <div className="p-5 flex flex-col items-center justify-center">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-4xl font-bold text-gray-800">{total}</p>
          </div>
          <button 
            onClick={() => handleNavigate(subsystem)}
            className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 ${color.replace('border-purple-300', 'bg-purple-500').replace('border-', 'bg-')}`}>
            <span>Manage {title.split(" ")[0]}s</span>
            <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#eeeee4] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Learning Management System</h1>
          <p className="text-gray-500">Administrative Dashboard</p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="User Management" 
            icon={Users} 
            total={dashboardData.users}
            color="border-blue-500"
            subsystem="users"
          />
          <DashboardCard 
            title="Support Management" 
            icon={MessageCircle} 
            total={dashboardData.support}
            color="border-green-500"
            subsystem="support"
          />
          <DashboardCard 
            title="Lecture Management" 
            icon={BookOpen} 
            total={dashboardData.lectures}
            color="border-purple-300"
            subsystem="lectures" 
          />
          <DashboardCard 
            title="Class Management" 
            icon={Grid} 
            total={dashboardData.classes}
            color="border-amber-500"
            subsystem="classes" 
          />
        </div>
      </div>
    </div>
  );
}