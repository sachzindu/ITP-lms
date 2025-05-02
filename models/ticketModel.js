import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    contactNumber: {
      type:Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    photo:{
      public_id:{
        type:String,
        required:true,
    },
    secure_url:{
        type:String,
        required:true,
    }
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket",ticketSchema);

