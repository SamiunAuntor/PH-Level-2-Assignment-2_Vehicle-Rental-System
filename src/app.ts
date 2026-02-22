import express, { Request, Response } from 'express';
import initDB from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoutes } from './modules/vehicles/vehicles.routes';
import { usersRoutes } from './modules/users/users.routes';

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

// default route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Vehicle Rental System !')
})

// auth routes
app.use('/api/v1/auth', authRoutes);

// vehicles routes
app.use('/api/v1/vehicles', vehiclesRoutes);

// users routes
app.use('/api/v1/users', usersRoutes);

// deafult 404 route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

export default app;