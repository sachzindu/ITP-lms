// backend/routes/ticketRoutes.js
import express from "express";
import {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicketStatus,
  updateTicket,
  deleteTicket,
  getTicketTimeline
} from "../controllers/ticketController.js";
import { upload } from "../middleware/requirePhoto.js";



const router = express.Router();

// health‐check
router.get("/debug", (req, res) =>
  res.json({ ok: true, method: req.method, url: req.originalUrl })
);

// CRUD + status + timeline
router.get(   "/",              getAllTickets);
router.get(   "/:id",           getTicket);
router.post(  "/", upload.single("file"), createTicket);
router.put(   "/:id/status",    updateTicketStatus);
router.put(   "/:id", upload.single("file"), updateTicket);
router.delete("/:id",           deleteTicket);
router.get(   "/:id/timeline",  getTicketTimeline);

export default router;
