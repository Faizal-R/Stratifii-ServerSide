import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import router from "./routes/route";
import dotenv from "dotenv";
import morganMiddleware from "./config/logger";

dotenv.config();


const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(morganMiddleware)

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));

app.use('/api',router)

// 🔹 Health Check Route
app.get("/health", (req, res) => {
    res.json({ message: " API is running successfully!" });
  });

app.use(
  (err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
);





export default app