import express from "express";
import { getCourses, createCourse, getCourseBySlug, getCourseById } from "../controllers/course.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.get("/slug/:slug", getCourseBySlug);
router.post("/", createCourse);

export default router;
