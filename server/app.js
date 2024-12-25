import express from "express";
import cors from "cors";
import sequelize from "./config/dbMysql.js";
import "./config/dotenv.js";
import courseRoutes from "./routes/courseRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import session from "express-session";
import crypto from "crypto";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
        },
    })
);

sequelize
    .authenticate()
    .then(async () => {
        console.log("Connection to the database successful");
        try {
            await sequelize.sync({ alter: true });
            console.log("Database & tables created!");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    });

app.use("/uploads", express.static("public/uploads"));

app.use("/api/user", userRoutes);

app.use("/api/course", courseRoutes);

app.use("/api/course-player/course/:courseId/chapters/:chapterId", courseRoutes);

app.use("/api/chapter", chapterRoutes);

// app.use("/api/video/create", videoRoutes);
app.use("/api/video", videoRoutes);

export default app;
