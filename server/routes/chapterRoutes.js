import express from "express";
import { getChapters, createChapter } from "../controllers/chapter.js";

const router = express.Router();

router.get("/", getChapters);

router.post("/", createChapter);

export default router;
