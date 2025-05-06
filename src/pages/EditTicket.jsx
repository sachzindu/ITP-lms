import  { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditTicket = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [grade, setGrade] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/ticket/${id}`)
    .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email)
        setRegistrationNumber(response.data.registrationNumber)
        setGrade(response.data.grade);
        setContactNumber(response.data.contactNumber)
        setCategory(response.data.category)
        setSubject(response.data.subject);
        setMessage(response.data.message)
        setFile(response.data.attachment)
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  }, [id])
  const handleEditBook = () => {
    // Name validation
    if (!/^[A-Za-z\s]+$/.test(name)) {
      enqueueSnackbar("Please enter letters only for Name", { variant: "error" });
      return;
    }
    // Email validation
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      enqueueSnackbar("Please enter a valid email address", { variant: "error" });
      return;
    }
    // Registration number validation
    if (!/^[a-zA-Z0-9]+$/.test(registrationNumber)) {
      enqueueSnackbar("Please enter alphanumeric characters only for Registration Number", { variant: "error" });
      return;
    }
    // Phone number validation
    if (!/^\d{10}$/.test(contactNumber)) {
      enqueueSnackbar("Please enter a 10-digit phone number", { variant: "error" });
      return;
    }
 

    
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("registrationNumber", registrationNumber);
    data.append("grade", grade);
    data.append("contactNumber", contactNumber);
    data.append("category", category);
    data.append("subject", subject);
    data.append("message", message);
    data.append("file", file);
    setLoading(true);
    axios
      .put(`http://localhost:5000/ticket/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ticket Edited successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="max-w-2xl mx-auto">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
          Edit Ticket
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="space-y-6">
            <InputField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
            <InputField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <InputField
              label="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              type="number"
            />
            <InputField
              label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              type="text"
            />
            <InputField
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              type="tel"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select category</option>
                <option value="Edu">Educational Issues</option>
                <option value="Tec">Technical Issues</option>
                <option value="Pay">Payment Issues</option>
              </select>
            </div>
            <InputField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              type="text"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <button
            onClick={handleEditBook}
            disabled={loading}
            className="w-full mt-8 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, value, onChange, type }) => (
  <div>
    
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  </div>
);

export default EditTicket;