import { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateTicket = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(""); // Fixed typo from setMassage to setMessage
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = () => {
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
    if (file) {
      data.append("file", file);
    }

    setLoading(true);
    axios
      .post("http://localhost:5000/ticket", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket created successfully", { variant: "success" });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating ticket", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
          Create New Ticket
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
              placeholder="Enter your name"
            />
            <InputField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
            <InputField
              label="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              type="text"
              placeholder="Enter registration number"
            />
            <InputField
              label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              type="text"
              placeholder="Enter grade"
            />
            <InputField
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              type="tel"
              placeholder="Enter 10-digit phone number"
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
              placeholder="Enter subject"
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
                placeholder="Describe your issue..."
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
            onClick={handleSaveBook}
            disabled={loading}
            className="w-full mt-8 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, value, onChange, type, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  </div>
);

export default CreateTicket;