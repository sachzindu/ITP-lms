// backend/controllers/ticketController.js
import { Ticket } from "../models/ticketModel.js";

/** Create a new ticket */
export const createTicket = async (req, res) => {
  try {
    const {
      name, email, registrationNumber,
      grade, contactNumber, category,
      subject, message
    } = req.body;

    if (
      !name || !email || !registrationNumber ||
      !grade || !contactNumber || !category ||
      !subject || !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const newTicket = {
      name, email, registrationNumber,
      grade, contactNumber, category,
      subject, message,
      photo: req.file?.filename || null,
      status: "submitted",
      statusHistory: [
        {
          status:    "submitted",
          updatedAt: new Date(),
          updatedBy: "system",
          notes:     "Ticket created"
        }
      ]
    };

    const ticket = await Ticket.create(newTicket);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Get all tickets */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) {
    console.error("Get all tickets error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Get single ticket */
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, data: ticket });
  } catch (err) {
    console.error("Get ticket error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Update only status and push to history */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status, notes } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            updatedAt: new Date(),
            updatedBy: "admin",
            notes: notes || ""
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, data: ticket });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Update entire ticket */
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, email, registrationNumber,
      grade, contactNumber, category,
      subject, message
    } = req.body;

    if (
      !name || !email || !registrationNumber ||
      !grade || !contactNumber || !category ||
      !subject || !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields required: name, email, registrationNumber, grade, contactNumber, category, subject, message"
      });
    }

    const updateData = {
      name, email, registrationNumber,
      grade, contactNumber, category,
      subject, message,
      ...(req.file && { photo: req.file.filename })
    };

    const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, data: ticket });
  } catch (err) {
    console.error("Full update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Delete a ticket */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    await ticket.deleteOne();
    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("Delete ticket error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** Get status timeline */
export const getTicketTimeline = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    const timeline = [
      {
        status:    "submitted",
        updatedAt: ticket.createdAt,
        updatedBy: "system",
        notes:     "Ticket created"
      },
      ...ticket.statusHistory
    ];
    res.json({ success: true, data: timeline });
  } catch (err) {
    console.error("Get timeline error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
