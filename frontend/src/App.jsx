import {Outlet} from 'react-router-dom'
import Navigation from './pages/Auth/Navigation';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from './Home/Footer';
import Navbar from './Home/Navbar';




function App() {

  return (
    <>
      <ToastContainer/>
      <Navigation/>

      <main className= "py-3">
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default App
