import { Chapter } from "../models/Chapter.js";
import { UserProgress } from "../models/UserProgress.js";
import { Video } from "../models/Video.js";

export const upsertUserProgress = async (req, res) => {
    try {
        const { userId, chapterId, progress, isComplete, videoId } = req.body;

        // Vérifier si un enregistrement existe
        let userProgress = await UserProgress.findOne({
            where: { userId, chapterId, videoId },
        });

        if (userProgress) {
            // Mettre à jour uniquement si la progression est meilleure
            if (progress > userProgress.progress || isComplete) {
                userProgress = await userProgress.update({ progress, isComplete });
            }
        } else {
            // Créer un nouvel enregistrement
            userProgress = await UserProgress.create({
                userId,
                chapterId,
                progress,
                isComplete,
                videoId,
            });
        }

        res.status(200).json(userProgress);
    } catch (error) {
        console.error("Erreur lors de la gestion de la progression utilisateur :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const chapterId = req.params.chapterId;

        if (!userId) {
            return res.status(200).json({
                progress: 0,
                isComplete: false,
                message: "Utilisateur non connecté",
            });
        }

        // Récupérer toutes les vidéos du chapitre
        const totalVideos = await Video.findAll({ where: { chapterId } });

        if (totalVideos.length === 0) {
            return res.status(200).json({
                progress: 0,
                isComplete: false,
                message: "Aucune vidéo dans ce chapitre",
            });
        }

        // Récupérer les vidéos complétées par l'utilisateur
        const userProgresses = await UserProgress.findAll({
            where: { userId, chapterId, isComplete: true },
        });

        const completedVideosCount = userProgresses.length;

        // Calculer la progression
        const progressPercentage = Math.round((completedVideosCount / totalVideos.length) * 100);

        res.status(200).json({
            progress: progressPercentage,
            isComplete: completedVideosCount === totalVideos.length,
            totalVideos: totalVideos.length,
            completedVideos: completedVideosCount,
            message: "Progression calculée avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression utilisateur :", error);
        res.status(500).json({
            progress: 0,
            isComplete: false,
            message: "Erreur interne lors de la récupération de la progression",
        });
    }
};

export const updateUserProgress = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const chapterId = req.params.chapterId;
        const isComplete = req.body.isComplete;
        const progress = req.body.progress;

        const userProgress = await userProgress.findOne({
            where: { userId, chapterId },
            include: [
                {
                    model: user,
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Chapter,
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!userProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }

        await userProgress.update({
            isComplete,
            progress,
        });

        res.status(200).json({ message: "User progress updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user progress" });
    }
};

export const getVideoProgress = async (req, res) => {
    try {
        const userId = req.session.user?.id; // Vérifier si l'utilisateur est authentifié
        const videoId = req.params.videoId; // ID de la vidéo depuis les paramètres

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        // Rechercher la progression de l'utilisateur pour cette vidéo
        const videoProgress = await UserProgress.findOne({
            where: {
                userId: userId,
                videoId: videoId,
            },
        });

        // Si aucune progression n'est trouvée, renvoyer une réponse par défaut
        if (!videoProgress) {
            return res.status(200).json({
                isComplete: false,
                progress: 0,
                message: "Aucune progression trouvée pour cette vidéo.",
            });
        }

        // Retourner les détails de la progression existante
        res.status(200).json({
            isComplete: videoProgress.isComplete,
            progress: videoProgress.progress,
            id: videoProgress.id,
            userId: videoProgress.userId,
            videoId: videoProgress.videoId,
            chapterId: videoProgress.chapterId,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la progression de la vidéo :", error);
        res.status(500).json({
            message: "Erreur lors de la récupération de la progression de la vidéo",
            error: error.message,
        });
    }
};
