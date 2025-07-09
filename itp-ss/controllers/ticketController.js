import { Ticket } from '../models/ticketModel.js';

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.json({
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single ticket
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    console.log('Updating ticket status:', {
      ticketId: req.params.id,
      newStatus: req.body.status
    });

    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = req.body.status;
    await ticket.save();

    res.json({ 
      success: true,
      message: 'Status updated successfully',
      ticket 
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get ticket timeline
export const getTicketTimeline = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const timeline = [
      {
        status: 'submitted',
        updatedAt: ticket.createdAt,
        updatedBy: 'system',
        notes: 'Ticket created'
      },
      ...ticket.statusHistory
    ];

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      grade,
      contactNumber,
      category,
      subject,
      message
    } = req.body;

    if (
      !name ||
      !email ||
      !registrationNumber ||
      !grade ||
      !contactNumber ||
      !category ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    const newTicket = {
      name,
      email,
      registrationNumber,
      grade,
      contactNumber,
      category,
      subject,
      message,
      photo: req.file ? req.file.filename : null,
      status: 'submitted',
      statusHistory: [{
        status: 'submitted',
        updatedAt: new Date(),
        updatedBy: 'system',
        notes: 'Ticket created'
      }]
    };

    const ticket = await Ticket.create(newTicket);
    return res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 