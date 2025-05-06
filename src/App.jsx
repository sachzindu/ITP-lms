import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import ShowTicket from './pages/ShowTicket';
import EditTicket from './pages/EditTicket';
import DeleteTicket from './pages/DeleteTicket';
import Navbar from './components/home/Navbar';
import Admin from './pages/admin';
import Footer from './components/home/Footer';
import About from './Home/src/components/About';
import Hero from './Home/src/components/Hero';
import Section2 from './Home/src/components/Section2';
const App = () => {
  return (

    <>
     <Navbar />

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/ticket/create' element={<CreateTicket />} />
      <Route path='/ticket/admin' element={<Admin />} />
      <Route path='/Home/About' element={<About />} />
      <Route path='/Home/Hero' element={<Hero />} />
      <Route path='/Home/section2' element={<Section2 />} />
      <Route path='/ticket/details/:id' element={<ShowTicket />} />
      <Route path='/ticket/edit/:id' element={<EditTicket />} />
      <Route path='/ticket/delete/:id' element={<DeleteTicket />} />
    </Routes>
    
    <Footer />
    </>
    
  );
};

export default App;
