import express from "express";
import { getCourses, createCourse, getCourseBySlug, getCourseById, updateCourse, deleteCourse } from "../controllers/course.js";
import upload from "../middlewares/multer-config.js";

const router = express.Router();

router.get("/", getCourses);

router.post("/create", upload.single("image"), createCourse);

router.get("/:id", getCourseById);

router.delete("/delete/:id", deleteCourse);

router.put("/update/:id", upload.single("image"), updateCourse);

router.get("/slug/:slug", getCourseBySlug);

export default router;
