import express from "express";
import { Ticket } from "../models/ticketModel.js";
import { upload } from "../middleware/requirePhoto.js";
import {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getTicketTimeline,
  updateStatus
} from '../controllers/ticketController.js';

const router = express.Router();

// Add this logging middleware
router.use((req, res, next) => {
  console.log('Ticket Route:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

// Debug middleware
router.use((req, res, next) => {
  console.log('Route accessed:', req.method, req.url);
  next();
});

// Debug route to test if routes are working
router.get('/debug', (req, res) => {
  res.json({ message: 'Ticket routes are working' });
});

// Remove both existing status update routes and replace with this one
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Received status update:', { id, status });

    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      console.log('Ticket not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update the ticket
    ticket.status = status;
    
    // Add to status history
    ticket.statusHistory = ticket.statusHistory || [];
    ticket.statusHistory.push({
      status: status,
      updatedAt: new Date(),
      updatedBy: 'admin'
    });

    await ticket.save();

    console.log('Updated ticket:', ticket);

    return res.json({
      success: true,
      message: 'Status updated successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all tickets
router.get('/', getAllTickets);

// Create new ticket
router.post('/', upload.single('file'), async (request, response) => {
  try {
    const newTicket = {
      name: request.body.name,
      email: request.body.email,
      registrationNumber: request.body.registrationNumber,
      grade: request.body.grade,
      contactNumber: request.body.contactNumber,
      category: request.body.category,
      subject: request.body.subject,
      message: request.body.message,
      photo: request.file ? request.file.filename : null,
      status: 'pending' // Set initial status
    };

    const ticket = await Ticket.create(newTicket);
    return response.status(201).json(ticket);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get single ticket
router.get('/:id', getTicket);

// Route for Get All Books from database
router.get("/", getAllTickets);

// Route for Get One Book from database by id
router.get("/:id", getTicket);

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
          "Send all required fields: name,email,registrationNumber,eventType,contactNo,InquiryType,subject,massage,attachment",
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
    const photo = request.file.filename;

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
router.delete("/:id", deleteTicket);

// Get ticket timeline
router.get('/:id/timeline', getTicketTimeline);

// Add this before your other routes
router.get('/test-status/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.json({
      success: true,
      ticket: {
        id: ticket._id,
        status: ticket.status,
        statusHistory: ticket.statusHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update ticket status
router.put('/:id/status', updateStatus);

export default router;
