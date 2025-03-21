import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import ticketRoutes from "./routes/ticketRoutes.js"; // ✅ Import without curly braces
//import ticketRoutes from './routes/ticketRoutes.js';
//import { router as ticketRoutes } from './routes/ticketRoutes.js';

import cors from 'cors';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome To MERN Stack Tutorial');
});

app.use('/ticket', ticketRoutes);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(5000, () => console.log(`Server running on port ${PORT}`));
    
  })
  .catch((error) => {
    console.log(error);
  });
