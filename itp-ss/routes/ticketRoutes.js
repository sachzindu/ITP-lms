import express from "express";
import { Ticket } from "../models/ticketModel.js";
import { upload } from "../middlewares/requirePhoto.js";
import cloudinary from 'cloudinary'


const router = express.Router();

// Route for Save a new Book
router.post("/",upload.single("file"), async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.registrationNumber ||
      !request.body.grade ||
      !request.body.contactNumber ||
      !request.body.category ||
      !request.body.subject ||
      !request.body.message
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: name,email,registrationNumber,eventType,contactNo,InquiryType,subject,massage,attachment",
      });
    }

    let ticketPubId="";
    let ticketPubUrl="";

    if(request.file){

      const result = await cloudinary.uploader.upload(request.file.path,{folder:"ticket"});
      ticketPubId=result.public_id;
      ticketPubUrl=result.secure_url;


    }
    const newBook = {
      name: request.body.name,
      email: request.body.email,
      registrationNumber: request.body.registrationNumber,
      grade: request.body.grade,
      contactNumber: request.body.contactNumber,
      category: request.body.category,
      subject: request.body.subject,
      message: request.body.message,
      photo:{
        secure_url:ticketPubUrl,
        public_id:ticketPubId
      }
    };

    const book = await Ticket.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Books from database
router.get("/", async (request, response) => {
  try {
    const books = await Ticket.find({});
    console.log(books);

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Book from database by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Ticket.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put("/:id", upload.single("file"), async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.registrationNumber ||
      !request.body.grade ||
      !request.body.contactNumber ||
      !request.body.category ||
      !request.body.subject ||
      !request.body.message
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: name,email,registrationNumber,categorys,contactNo,InquiryType,subject,massage,attachment",
      });
    }

    const { id } = request.params;
    const {
      name,
      email,
      registrationNumber,
      grade,
      contactNumber,
      category,
      subject,
      message,
    } = request.body;

    let ticketPubId="";
    let ticketPubUrl="";

    if(request.file){

      const result = await cloudinary.uploader.upload(request.file.path,{folder:"ticket"});
      ticketPubId=result.public_id;
      ticketPubUrl=result.secure_url;


    }

 const photo = {public_id:ticketPubId,secure_url:ticketPubUrl};

    const result = await Ticket.findByIdAndUpdate(id, {
      name,
      email,
      registrationNumber,
      grade,
      contactNumber,
      category,
      subject,
      message,
      photo,
    });

    if (!result) {
      return response.status(404).json({ message: "Ticket not found" });
    }

    return response.status(200).send({ message: "Ticket updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Ticket.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Ticket not found" });
    }

    return response.status(200).send({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
router.post('/create', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'Ticket created successfully' });
});

export default router;

