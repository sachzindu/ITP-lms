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

import InstructorDashboard from './pages/Instructor/InstructorDashboard.jsx';
import InstructorRoute from './pages/Instructor/InstructorRoute.jsx';

import StudentRoute from './pages/Student/StudentRoute.jsx';
import StudentDashboard from './pages/Student/StudentDashboard.jsx';

//Home
import About from './Home/About.jsx';
import AllInOne from './Home/Allinone.jsx';
import Hero from './Home/Hero.jsx';
import Navbar from './Home/Navbar.jsx';
import Section2 from './Home/Section2.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route path='/login' element={<Login/>}> </Route>
    <Route path='/register' element={<Register/>}> </Route>

    {/* Home Routes */}
    <Route path='/about' element={<About/>}></Route>
    <Route path='/allInOne' element={<AllInOne/>}></Route>
    <Route path='/navbar' element={<Navbar/>}></Route>
    <Route path='/section2' element={<Section2/>}></Route>

   



   






    <Route path='' element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile/>} />
    </Route>
    
     {/* Admin Routes */}
     <Route path='/admin' element={<AdminRoute/>}>
     <Route path='userlist' element={<UserList />}></Route>
    <Route path='dashboard' element={<AdminDashboard />}></Route>
    


     </Route>

     {/* Instructor Routes */}
     <Route path='/instructor' element={<InstructorRoute/>}>
    <Route path='dashboard' element={<InstructorDashboard />}></Route>
    


     </Route>

     {/* Instructor Routes */}
     <Route path='/student' element={<StudentRoute/>}>
    <Route path='dashboard' element={<StudentDashboard />}></Route>
    


     </Route>


    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}> 
<RouterProvider router={router}/>
</Provider>
);