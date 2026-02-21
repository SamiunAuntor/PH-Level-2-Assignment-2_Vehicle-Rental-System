import express, { Request, Response } from 'express';
import config from './config';

const app = express();

// parser
app.use(express.json());

app.get('/', (req: Request, res) => {
    res.send('Welcome to the Vehicle Rental System !')
})

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

export default app;