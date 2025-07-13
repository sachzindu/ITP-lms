import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import "./index.css";
import {Route, RouterProvider, createRoutesFromElements} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./redux/features/store.js"

//Private Route
import PrivateRoute from './components/PrivateRoute.jsx';


//Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

import Profile from './pages/User/Profile.jsx';

import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';

//Instructor
import InstructorDashboard from './pages/Instructor/InstructorDashboard.jsx';
import InstructorRoute from './pages/Instructor/InstructorRoute.jsx';
import CreateAssignment from './pages/Instructor/CreateAssignment.jsx'
import AllAssignments from './pages/Instructor/AllAssignments.jsx'
import Assignmentdetails from './pages/Instructor/Assignmentdetails.jsx'
import UpdateAssignment from './pages/Instructor/UpdateAssignment.jsx'
import ClassListOfTeachers from './pages/Instructor/ClassListOfTeacher.jsx';
import ClassListAssignment from './pages/Student/ClassListAssignment.jsx';

//Student
import StudentRoute from './pages/Student/StudentRoute.jsx';
import StudentDashboard from './pages/Student/StudentDashboard.jsx';
import StudentClasses from './pages/Student/StudentClasses.jsx'
import PaymentForm from './pages/Student/Payment.jsx';
import PForm from './pages/Student/PForm.jsx';
import Seeclassdetails from './pages/Student/Seeclassdetails.jsx';
import StudentAssignmentDetails from './pages/Student/StudentAssignmentDetails.jsx';
import VideoListView from './pages/Student/VideoListView.jsx';
import VideoPlayer from './pages/Student/VideoPlayer.jsx';
import EnrolledClasses from './pages/Student/EnrolledClasses.jsx';
import ClassListVideo from './pages/Student/ClassListVideo.jsx';

//Home
import About from './Home/About.jsx';
import AllInOne from './Home/Allinone.jsx';
import Hero from './Home/Hero.jsx';
import Navbar from './Home/Navbar.jsx';
import Section2 from './Home/Section2.jsx';
import TicketHome from './pages/Admin/TicketHome.jsx';
import Homepage from './Home/Homepage.jsx'

//admin
import Allclasses from './pages/Admin/Allclasses.jsx'
import Classdetails from './pages/Admin/Classdetails.jsx';
import UpdateClass from './pages/Admin/UpdateClass.jsx';
import CreateLec from './pages/Admin/CreateLec.jsx'
import LecPreview from './pages/Admin/LecPreview.jsx';
import UpdateLec from './pages/Admin/UpdateLec.jsx';
import ClassListLec from './pages/Admin/ClassListLec.jsx';
import CreateClassForm from './pages/Admin/CreateClassForm.jsx';
import CreateTicket from './pages/Admin/CreateTicket.jsx';
import SupportAdmin from './pages/Admin/SupportAdmin.jsx'
import EditTicket from './pages/Admin/EditTicket.jsx'
import DeleteTicket from './pages/Admin/DeleteTicket.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx';
import AssignmentListStudent from './pages/Student/AssignmentListStudent.jsx';
import ShowTicket from './pages/Admin/ShowTicket.jsx';
import TicketTimeline from './pages/Admin/TicketTimeline.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route path='/login' element={<Login/>}> </Route>
    <Route path='/register' element={<Register/>}> </Route>

    {/* Home Routes */}
    <Route path='/about' element={<About/>}></Route>
    <Route path='/allInOne' element={<AllInOne/>}></Route>
    <Route path='/navbar' element={<Navbar/>}></Route>
     <Route path='/home' element={<Homepage/>}></Route>
    <Route path='/section2' element={<Section2/>}></Route>
    <Route path='' element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>} />
    </Route>
    
     {/* Admin Routes */}
     <Route path='/admin' element={<AdminRoute/>}>
     <Route path='dashboard' element={<Dashboard/>}></Route>
     <Route path='userlist' element={<UserList />}></Route>
    <Route path='userdashboard' element={<AdminDashboard />}></Route>
    <Route path='allclasses' element={<Allclasses />}></Route>
    <Route path='classdetails' element={<Classdetails />}></Route>
    <Route path='updateclass' element={<UpdateClass />}></Route>
    <Route path='createlec' element={<CreateLec/>}></Route>
    <Route path='classlistlec' element={<ClassListLec/>}></Route>
    <Route path='previewlec' element={<LecPreview/>}></Route>
      <Route path='updatelec' element={<UpdateLec/>}></Route>
      <Route path='createclass' element={<CreateClassForm/>}></Route>
      <Route path='createticket' element={<CreateTicket/>}></Route>
      <Route path='supportadmin' element={<SupportAdmin/>}></Route>
      <Route path='editticket/:id' element={<EditTicket/>}></Route>
      <Route path='deleteticket/:id' element={<DeleteTicket/>}></Route>
      <Route path='ticket/:id' element={<ShowTicket/>}></Route>
      <Route path='timeline/:id' element={<TicketTimeline/>}></Route>
      </Route>

      <Route path="/ticket" element={<TicketHome/>}></Route>
      <Route path="/ticket/create" element={<CreateTicket/>}></Route>




     {/* Instructor Routes */}
     <Route path='/instructor' element={<InstructorRoute/>}>
    <Route path='dashboard' element={<InstructorDashboard />}></Route>
    <Route path='createassignment' element={<CreateAssignment />}></Route>
    <Route path='allassignments' element={<AllAssignments />}></Route>
    <Route path='assignmentdetails' element={<Assignmentdetails/>}></Route>
    <Route path='updateassignment' element={<UpdateAssignment />}></Route>
    <Route path='classlistofteacher' element={<ClassListOfTeachers/>}></Route>
  


     </Route>

     




     {/* student Routes */}
     <Route path='/student' element={<StudentDashboard/>}>
     <Route path='dashboard' element={<StudentClasses/>}></Route>
     <Route path='seeclassdetails' element={<Seeclassdetails/>}></Route>
     <Route path='addstudent' element={<PForm/>}></Route>
     <Route path='classlistassignment' element={<ClassListAssignment/>}></Route>
     <Route path='classlistvideo' element={<ClassListVideo/>}></Route>
     <Route path='assignment/:classId' element={<AssignmentListStudent/>}></Route>
     <Route path='assignment/upload/:assignmentId' element={<StudentAssignmentDetails/>}></Route>
     <Route path='videolistview/:lecid' element={<VideoListView/>}></Route>
     <Route path='videoplayer' element={<VideoPlayer/>}></Route>
     <Route path='enrolled' element={<EnrolledClasses/>}></Route>
     <Route path='ticketdetails/:id' element={<ShowTicket/>}></Route>
     
     </Route>


    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}> 
<RouterProvider router={router}/>
</Provider>
);