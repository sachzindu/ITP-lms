import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import ShowTicket from './pages/ShowTicket';
import EditTicket from './pages/EditTicket';
import DeleteTicket from './pages/DeleteTicket';
import Navbar from './components/home/Navbar';
import Admin from './pages/admin';
import Footer from './components/home/Footer';

const App = () => {
  return (

    <>
     <Navbar />

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/ticket/create' element={<CreateTicket />} />
      <Route path='/ticket/admin' element={<Admin />} />

      <Route path='/ticket/details/:id' element={<ShowTicket />} />
      <Route path='/ticket/edit/:id' element={<EditTicket />} />
      <Route path='/ticket/delete/:id' element={<DeleteTicket />} />
    </Routes>
    
    <Footer />
    </>
    
  );
};

export default App;
