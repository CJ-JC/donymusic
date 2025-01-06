import { Course } from "../models/Course.js";
import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";
import fs from "fs";
import { Category } from "../models/Category.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            attributes: ["id", "title", "description", "price", "videoUrl", "imageUrl", "slug", "createdAt", "isPublished"],
            // where: {
            //     isPublished: true,
            // },
            include: [
                {
                    model: Chapter,
                    attributes: ["id", "title", "description", "attachment"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
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
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
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
        const { title, slug, description, price, videoUrl, categoryId } = req.body;
        const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;

        if (!title || !price || !description || !videoUrl || !imagePath || !categoryId) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        // Vérifiez que la catégorie existe
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "La catégorie spécifiée est introuvable." });
        }

        // Vérifiez les doublons
        const existingCourse = await Course.findOne({ where: { title } });
        if (existingCourse) {
            fs.unlinkSync(`public${imagePath}`);
            return res.status(400).json({ error: "Un cours avec ce nom existe déjà." });
        }

        // Créez le cours
        const newCourse = await Course.create({
            imageUrl: imagePath,
            title,
            slug,
            description,
            price: parseFloat(price),
            videoUrl,
            categoryId: parseInt(categoryId),
        });

        res.status(201).json({ message: "Cours créé avec succès", result: newCourse });
    } catch (error) {
        console.error("Erreur Sequelize :", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            const details = error.errors.map((e) => e.message);
            return res.status(400).json({ error: `Erreur de validation : ${details.join(", ")}` });
        }

        res.status(500).json({ error: `Erreur lors de la création du cours : ${error.message}` });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, price, videoUrl, categoryId } = req.body;

        // Vérification des champs obligatoires
        if (!title || !slug || !description || !price || !videoUrl || !categoryId) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        // Vérifiez que la catégorie existe
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ error: "La catégorie spécifiée est introuvable." });
        }

        const course = await Course.findByPk(id);
        if (!course) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        // Vérification si le prix est un nombre valide
        if (isNaN(parseFloat(price))) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(400).json({ error: "Le prix doit être un nombre valide" });
        }

        let imagePath = course.imageUrl;
        if (req.file) {
            imagePath = `/uploads/images/${req.file.filename}`;
            // Supprime l'ancienne image si elle existe
            if (course.imageUrl && fs.existsSync(`public${course.imageUrl}`)) {
                fs.unlinkSync(`public${course.imageUrl}`);
            }
        }

        const [rowsUpdated, updatedCourses] = await Course.update(
            {
                title,
                slug: slug.toLowerCase(),
                description,
                imageUrl: imagePath,
                price: parseFloat(price),
                videoUrl,
                categoryId: parseInt(categoryId),
            },
            {
                where: { id },
                returning: true,
            }
        );

        // Vérifiez si des lignes ont été mises à jour
        if (rowsUpdated === 0 || updatedCourses.length === 0) {
            return res.status(404).json({ error: "Cours non trouvé ou aucune modification détectée." });
        }

        // Retourner le premier cours mis à jour
        res.status(200).json({ message: "Cours mis à jour avec succès", result: updatedCourses[0] });
    } catch (error) {
        // Si une erreur survient et qu'une image a été uploadée, on la supprime
        if (req.file) {
            fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
        }
        res.status(500).json({ error: `Erreur lors de la mise à jour du cours : ${error.message}` });
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
                    attributes: ["id", "title", "description", "attachment"],
                    include: [
                        {
                            model: Video,
                            attributes: ["id", "url", "title"],
                        },
                    ],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title"],
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

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: "Cours non trouvé" });
        }

        await course.destroy();

        fs.unlinkSync(`public${course.imageUrl}`);

        await Video.destroy({ where: { chapterId: id } });

        res.status(200).json({ message: "Cours supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du cours: ${error.message}`,
        });
    }
};

export const togglePublishCourse = async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Cours introuvable" });
        }

        course.isPublished = isPublished;
        await course.save();

        res.status(200).json({ message: "Statut mis à jour", isPublished: course.isPublished });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};
