import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: [
            "https://Campus-Connect.vercel.app",
            "http://localhost:5173",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Import routes


app.get("/api/v1", (req, res) => res.send("Backend of Campus Connect"));

//routes declaration

export { app };
