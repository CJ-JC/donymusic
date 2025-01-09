import express from "express";
import { updateUserProgress, upsertUserProgress, getVideoProgress, getUserCourseProgress } from "../controllers/userProgress.js";

const router = express.Router();

router.get("/:courseId", getUserCourseProgress);

router.post("/create", upsertUserProgress);

router.post("/edit/:chapterId", updateUserProgress);

router.get("/video/:videoId", getVideoProgress);

export default router;
