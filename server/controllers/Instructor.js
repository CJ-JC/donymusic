import { Instructor } from "../models/Instructor.js";
import { Masterclass } from "../models/Masterclass.js";
import { Files } from "../models/Files.js";
import fs from "fs";

export const createInstructor = async (req, res) => {
    const { name, biography, imageUrl } = req.body;

    // Vérification des champs obligatoires
    if (!name || !biography || !imageUrl) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    try {
        // Vérifier si l'image existe déjà
        const existingImage = await Files.findOne({ where: { path: imageUrl } });
        if (existingImage) {
            fs.unlinkSync(`public${imageUrl}`);
            return res.status(400).json({ error: "Un fichier avec ce nom existe déjà." });
        }
        // Créer l'image
        const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;
        console.log(req.body, imagePath);

        // Vérifier si l'image a été téléchargée
        if (imagePath) {
            const image = await Files.create({ title: "image", path: imagePath, courseId: null });
            // Mettre à jour l'imageUrl
            imageUrl = `/uploads/images/${image.filename}`;
        }

        // Créer l'instructeur
        const instructor = await Instructor.create({ name, biography, imageUrl });

        res.status(201).json(instructor);
    } catch (error) {
        console.error("Erreur lors de la création de l'instructeur :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'instructeur" });
    }
};

export const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findOne({
            where: { id },
            include: [
                {
                    model: Masterclass,
                    attributes: ["id", "title"],
                },
            ],
        });

        if (!instructor) {
            return res.status(404).json({ message: "Instructeur non trouvé" });
        }

        res.status(200).json(instructor);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'instructeur :", error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'instructeur" });
    }
};

export const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, biography, imageUrl } = req.body;

        // Vérifier les champs obligatoires
        if (!name || !biography || !imageUrl) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(404).json({ error: "Instructeur non trouvé" });
        }

        // Vérifier si l'image existe déjà
        let existingImage = await Files.findOne({ where: { path: imageUrl } });
        if (existingImage) {
            fs.unlinkSync(`public${imageUrl}`);
            return res.status(400).json({ error: "Un fichier avec ce nom existe déjà." });
        }

        // Créer l'image
        const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;
        console.log(req.body, imagePath);

        // Vérifier si l'image a été téléchargée
        if (imagePath) {
            existingImage = await Files.create({ title: "image", path: imagePath, courseId: null });
            // Mettre à jour l'imageUrl
            imageUrl = `/uploads/images/${existingImage.filename}`;
        }

        await instructor.update(
            {
                name,
                biography,
                imageUrl,
            },
            {
                where: { id },
                returning: true,
            }
        );

        res.status(200).json({ message: "Instructeur mis à jour avec succès", result: instructor });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'instructeur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'instructeur" });
    }
};

export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findByPk(id);
        if (!instructor) {
            return res.status(404).json({ message: "Instructeur non trouvé" });
        }

        await instructor.destroy();

        res.status(200).json({ message: "Instructeur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'instructeur" });
    }
};
