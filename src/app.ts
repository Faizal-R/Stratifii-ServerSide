import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import router from "./routes/route";

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));

app.use('/api',router)

// 🔹 Health Check Route
app.get("/", (req, res) => {
    res.json({ message: " API is running successfully!" });
  });

app.use((err:any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });




export default app