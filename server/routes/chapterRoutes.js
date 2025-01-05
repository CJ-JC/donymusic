import express from "express";
import { getChapters, getChapterById, createChapter, editChapter, deleteChapter, deleteChapterAttachment } from "../controllers/chapter.js";
import upload from "../middlewares/multer-config.js";

const router = express.Router();

router.get("/", getChapters);
router.get("/:id", getChapterById);
router.delete("/delete/:id", deleteChapter);
router.delete("/:id/attachment", deleteChapterAttachment);
router.post("/create", upload.single("attachment"), createChapter);
router.put("/edit/:id", upload.single("attachment"), editChapter);

export default router;
