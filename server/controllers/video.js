import { Video } from "../models/Video.js";

export const getVideos = async (req, res) => {
    try {
        const videos = await Video.findAll();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des vidéos" });
    }
};

export const createVideo = async (req, res) => {
    try {
        const video = await Video.create(req.body);
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: "Error creating vidéos" });
    }
};
