
import path from 'path'
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT;
const app = express();

// body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // cookie parser middleware we can access req.cookie
app.use(cors());


connectDB();


// routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
})

// make upload folder static
const __dirname = path.resolve();// set dir_name to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/ttdcomm/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'ttdcomm', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.send('API is running....');
    });
}
// error handlers
app.use(errorHandler);
app.use(notFound);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})