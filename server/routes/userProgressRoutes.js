import express from "express";
import { getUserProgress, updateUserProgress, upsertUserProgress, getVideoProgress } from "../controllers/userProgress.js";

const router = express.Router();

router.get("/:chapterId", getUserProgress);

router.post("/create", upsertUserProgress);

router.post("/edit/:chapterId", updateUserProgress);

router.get("/video/:videoId", getVideoProgress);

export default router;
