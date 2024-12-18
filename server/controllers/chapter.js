import { Chapter } from "../models/Chapter.js";

export const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chapters" });
    }
};

export const createChapter = async (req, res) => {
    try {
        const chapter = await Chapter.create(req.body);

        res.status(201).json(chapter);
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ error: error.message });
    }
};

// [
//     {
//       "title": "Chapter 1: Variables and Data Types",
//       "description": "Understand variables, constants, and JavaScript data types.",
//       "videoUrl": "https://outils-javascript.aliasdmc.fr/img/videos/mov_bbb.ogv",
//       "courseId": 1
//     },
// {
//   "title": "Chapter 2: Functions and Scope",
//   "description": "Learn about functions, scope, and how to write reusable code.",
//   "videoUrl": "https://outils-javascript.aliasdmc.fr/img/videos/mov_bbb.ogv",
//   "courseId": 1
// },
//     {
//       "title": "Chapter 3: DOM Manipulation",
//       "description": "Interact with web pages using the Document Object Model.",
//       "videoUrl": "https://outils-javascript.aliasdmc.fr/img/videos/mov_bbb.mp4",
//       "courseId": 1
//     }
//   ]
