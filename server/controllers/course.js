import { Course } from "../models/Course.js";
import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            attributes: ["id", "title", "description", "price", "videoUrl", "imageUrl", "slug"],
            include: [
                {
                    model: Chapter,
                    attributes: ["id", "title", "description"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des cours" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({
            where: { id },
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Erreur lors de la récupération du cours:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error creating course" });
    }
};

export const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({
            where: { slug },
            attributes: ["id", "title", "description", "price", "videoUrl", "imageUrl", "slug"],
            include: [
                {
                    model: Chapter,
                    attributes: ["id", "title", "description"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du cours" });
    }
};
