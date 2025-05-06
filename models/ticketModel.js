// backend/models/ticketModel.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    grade: { type: String, required: true },
    contactNumber: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    photo: { type: String },
    status: {
      type: String,
      enum: ["submitted", "assigned", "in_progress", "resolved"],
      default: "submitted"
    },
    statusHistory: [
      {
        status: String,
        updatedAt: Date,
        updatedBy: String,
        notes: String
      }
    ]
  },
  { timestamps: true }
);

// named export so controller can import { Ticket }
export const Ticket = mongoose.model("Ticket", ticketSchema);
