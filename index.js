// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes.js";
import 'punycode/';    // registers the userland fallback


const app  = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Root health-check ---
app.get("/", (req, res) =>
  res.json({ success: true, message: "Support Ticket API is up 🚀" })
);

// --- Mount ticket routes ---
app.use("/ticket", ticketRoutes);


// --- 404 for unmatched ---
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
);

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// --- Connect to Mongo & start ---
mongoose
  .connect("mongodb://127.0.0.1:27017/support-ticket-system", {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
