import { Chapter } from "../models/Chapter.js";
import { Video } from "../models/Video.js";
import fs from "fs";
import path from "path";

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
        const { title, description, courseId } = req.body;
        let videos = [];

        // Convertir le champ "videos" en tableau JSON
        try {
            videos = JSON.parse(req.body.videos);
        } catch (error) {
            return res.status(400).json({ error: "Le format des vidéos est invalide." });
        }

        // Gestion du fichier attaché
        const attachment = req.file ? `/uploads/attachments/${req.file.filename}` : null;

        // Vérification des champs obligatoires
        if (!title || !description || !courseId || !Array.isArray(videos)) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        // Création du chapitre
        const chapter = await Chapter.create({
            title,
            description,
            courseId,
            attachment: attachment, // Ajouter le fichier
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
        const { title, description, courseId } = req.body;
        let videos = [];

        // Parser les vidéos si elles sont présentes
        try {
            videos = JSON.parse(req.body.videos);
        } catch (error) {
            return res.status(400).json({ error: "Le format des vidéos est invalide" });
        }

        // 1. Mise à jour du chapitre
        const chapter = await Chapter.findByPk(id);
        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        // Gestion du fichier attaché
        let attachment = chapter.attachment; // Garder l'ancien chemin par défaut
        if (req.file) {
            // Si un nouveau fichier est uploadé
            attachment = `/uploads/attachments/${req.file.filename}`;

            // Supprimer l'ancien fichier s'il existe
            if (chapter.attachment) {
                const oldFilePath = path.join(process.cwd(), "public", chapter.attachment);
                try {
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log("Ancien fichier supprimé avec succès");
                    }
                } catch (err) {
                    console.error("Erreur lors de la suppression de l'ancien fichier:", err);
                }
            }
        }

        // Vérification des champs obligatoires
        if (!title || !description || !courseId) {
            return res.status(400).json({ error: "Les champs titre, description et courseId sont obligatoires" });
        }

        await chapter.update({
            title,
            description,
            courseId,
            attachment,
        });

        // 2. Mise à jour des vidéos
        // Supprimer toutes les anciennes vidéos
        await Video.destroy({
            where: { chapterId: id },
        });

        // Créer les nouvelles vidéos seulement si le tableau n'est pas vide
        if (Array.isArray(videos) && videos.length > 0) {
            const videoPromises = videos.map((video) => {
                return Video.create({
                    title: video.title,
                    url: video.url,
                    chapterId: id,
                });
            });

            await Promise.all(videoPromises);
        }

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

        // Supprimer le fichier attaché s'il existe
        if (chapter.attachment) {
            const filePath = path.join(process.cwd(), "public", chapter.attachment);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("Fichier attaché supprimé avec succès");
                }
            } catch (err) {
                console.error("Erreur lors de la suppression du fichier attaché:", err);
            }
        }

        // Supprimer les vidéos associées
        await Video.destroy({
            where: { chapterId: id },
        });

        // Supprimer le chapitre
        await chapter.destroy();

        res.status(200).json({ message: "Chapitre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du chapitre: ${error.message}`,
        });
    }
};

export const deleteChapterAttachment = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findByPk(id);

        if (!chapter) {
            return res.status(404).json({ error: "Chapitre non trouvé" });
        }

        if (!chapter.attachment) {
            return res.status(400).json({ error: "Aucun fichier attaché à supprimer" });
        }

        // Supprimer le fichier physiquement
        const filePath = path.join(process.cwd(), "public", chapter.attachment);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("Fichier attaché supprimé avec succès");
            }
        } catch (err) {
            console.error("Erreur lors de la suppression du fichier attaché:", err);
            return res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
        }

        // Mettre à jour le chapitre pour enlever la référence au fichier
        await chapter.update({ attachment: null });

        res.status(200).json({
            message: "Fichier attaché supprimé avec succès",
            chapter: chapter,
        });
    } catch (error) {
        res.status(500).json({
            error: `Erreur lors de la suppression du fichier: ${error.message}`,
        });
    }
};
