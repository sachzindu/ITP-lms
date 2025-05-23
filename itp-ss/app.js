import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import lectureRoutes from './routes/lecture.Routes.js'
import assignmentRoutes from './routes/assignment.Routes.js'
import userRoutes from './routes/userRoutes.js'





config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: 'http://localhost:5174',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials:false
    })
  );

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping',function(_req,res){
    res.send('Pong');
})


app.use('/api/course', courseRoutes)
app.use('/api/ticket', ticketRoutes);
app.use('/api/lecs', lectureRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/users', userRoutes);



app.all('*',(_req,res)=>{
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;