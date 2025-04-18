import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from 'http';  // Import http module
import connectDB from "./utils/db.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createServer } from "http";
import rateLimit from "express-rate-limit";
import userRoute from "./routes/user.route.js";  
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import swaggerOptions from "./utils/swagger.js"; 
import socketIo from './utils/socket.js';



dotenv.config();
const corsOptions = {
  origin: "*",  // Allow all origins
  methods: "GET,POST,PUT,DELETE",  // Allow these HTTP methods
  allowedHeaders: "Content-Type,Authorization",  // Allow headers
};


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions)); 

const PORT = process.env.PORT || 3000;

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions); // Generate the Swagger documentation from swaggerOptions

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter); // Apply globally
// Create the HTTP server with express
const server = createServer(app);

// Now pass the server to the socket.io setup
socketIo(server);


// Ensure this line points to the correct route
app.use("/api/v1", userRoute);  // Make sure you have this route correctly mapped

// Other API routes
app.use("/api/v1", companyRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", applicationRoute);

// Swagger API docs route
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
