import express from "express";
import cors from "cors";
import sequelize from "./config/dbMysql.js";
import "./config/dotenv.js";
import courseRoutes from "./routes/courseRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS simplifiée
app.use(cors());

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

// Simplification des routes
app.use("/api/course", courseRoutes);
app.use("/api/course/create", courseRoutes);

// app.use("/api/course/{id}", courseRoutes);

app.use("/api/course-player/course/:courseId/chapters/:chapterId", courseRoutes);
app.use("/api/detail/slug/{id}", courseRoutes);

app.use("/api/chapter", chapterRoutes);
app.use("/api/chapter/create", chapterRoutes);

app.use("/api/video/create", videoRoutes);
app.use("/api/video", videoRoutes);

export default app;
