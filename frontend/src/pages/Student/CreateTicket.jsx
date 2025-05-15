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
  const [message, setMassage] = useState("");
  const [file, setFile] = useState({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveBook = () => {
    // Name validation
    if (!/^[A-Za-z]+$/.test(name)) {
      enqueueSnackbar("Please enter letters only for Name", {
        variant: "error",
      });
      return;
    }
    // Email validation
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      enqueueSnackbar("Please enter a valid email address", {
        variant: "error",
      });
      return;
    }
    // Registration number validation
    if (!/^[a-zA-Z0-9]+$/.test(registrationNumber)) {
      enqueueSnackbar(
        "Please enter alphanumeric characters only for Registration Number",
        { variant: "error" }
      );
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(contactNumber)) {
      enqueueSnackbar("Please enter a 10-digit phone number", {
        variant: "error",
      });
      return;
    }

    /*
    const data = {
      name,
      email,
      registrationNumber,
      grade,
      contactNumber,
      category,
      subject,
      message,
      attachment,

    };*/

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
    console.log(file);
    setLoading(true);
    axios
      .post("http://localhost:5000/ticket", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket Created successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        enqueueSnackbar("Error", { variant: "error" });
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
      <div className="max-w-2xl mx-auto">      <BackButton />
      <h1 className="text-3xl my-4">Create Ticket</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Reg_No</label>
          <input
            type="string"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Grade</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Contact_No</label>
          <input
            type="string"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          >
            <option value="">Select category</option>
            <option value="Edu">Educational Issues</option>
            <option value="Tec">Technical Issues</option>
            <option value="Pay">Payment Issues</option>
          </select>
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMassage(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">File</label>
          <input
            type="File"
            onChange={(e) => setFile(e.target.files[0])}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveBook}>
          Save
        </button>
      </div>
    </div>
    </div>

  );
};

export default CreateTicket;
