import express, { Request, Response } from 'express';
import config from './config';
import initDB from './config/db';

const app = express();

// parser
app.use(express.json());

// initialize database
try {
    initDB();
}
catch (error) {
    console.error("Error initializing database:", error);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Vehicle Rental System !')
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

export default app;