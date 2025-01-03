import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";

export const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chapters" });
    }
};

export const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findOne({
            where: { id },
            include: [
                {
                    model: Video,
                    attributes: ["id", "url", "title"],
                },
            ],
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapitre non trouvé" });
        }

        res.status(200).json(chapter);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération du chapitre",
            error: error.message,
        });
    }
};

export const createChapter = async (req, res) => {
    try {
        const { title, description, courseId, videos } = req.body;

        // Vérification des champs obligatoires
        if (!title || !description || !courseId || !videos || !Array.isArray(videos)) {
            return res.status(400).json({ error: "Tous les champs sont requis et videos doit être un tableau" });
        }

        // Création du chapitre
        const chapter = await Chapter.create({
            title,
            description,
            courseId,
        });

        // Création des vidéos associées
        const videoPromises = videos.map((video) => {
            return Video.create({
                title: video.title,
                url: video.url,
                chapterId: chapter.id,
            });
        });

        await Promise.all(videoPromises);

        // Récupération du chapitre avec ses vidéos
        const chapterWithVideos = await Chapter.findOne({
            where: { id: chapter.id },
            include: [Video],
        });

        res.status(201).json({
            message: "Chapitre et vidéos créés avec succès",
            chapter: chapterWithVideos,
        });
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la création du chapitre: ${error.message}` });
    }
};

export const editChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, courseId, videos } = req.body;

        // Vérification des champs obligatoires
        if (!title || !description || !courseId || !videos) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        // 1. Mise à jour du chapitre
        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        await chapter.update({
            title,
            description,
            courseId,
        });

        // 2. Mise à jour des vidéos
        // Supprimer toutes les anciennes vidéos
        await Video.destroy({
            where: { chapterId: id },
        });

        // Créer les nouvelles vidéos
        const videoPromises = videos.map((video) => {
            return Video.create({
                title: video.title,
                url: video.url,
                chapterId: id,
            });
        });

        await Promise.all(videoPromises);

        // Récupérer le chapitre mis à jour avec ses vidéos
        const updatedChapter = await Chapter.findOne({
            where: { id },
            include: [Video],
        });

        res.status(200).json({
            message: "Chapitre et vidéos mis à jour avec succès",
            chapter: updatedChapter,
        });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            error: `Erreur lors de la mise à jour du chapitre: ${error.message}`,
        });
    }
};

export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        await chapter.destroy();

        await Video.destroy({
            where: { chapterId: id },
        });

        res.status(200).json({ message: "Chapitre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du chapitre: ${error.message}`,
        });
    }
};
