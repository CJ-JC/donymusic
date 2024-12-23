import express from "express";
import { createChapter, editChapter, getChapterById, deleteChapter } from "../controllers/chapter.js";

const router = express.Router();

router.post("/create", createChapter);

router.put("/edit/:id", editChapter);

router.get("/:id", getChapterById);

router.delete("/delete/:id", deleteChapter);

export default router;
