import express from "express";
import upload from "../middlewares/multer-config.js";

const router = express.Router();

router.post("/create", upload.single("images"));

router.get("/:id", getInstructorById);

router.put("/update/:id", upload.single("images"));

router.delete("/delete/:id", deleteInstructor);

export default router;
