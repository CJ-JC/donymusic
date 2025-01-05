import slugify from "slugify";
import { Masterclass } from "../models/Masterclass.js";
import fs from "fs";

export const getMasterclasses = async (req, res) => {
    try {
        const masterclasses = await Masterclass.findAll();
        res.status(200).json(masterclasses);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des masterclasses" });
    }
};

export const createMasterclass = async (req, res) => {
    try {
        const { title, description, startDate, endDate, price, duration, maxParticipants } = req.body;
        const imagePath = req.file ? `/uploads/images/${req.file.filename}` : null;
        console.log(req.body, imagePath);

        // Vérifier les champs obligatoires
        if (!title || !description || !startDate || !endDate || !price || !duration || !maxParticipants) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier que les dates sont dans le bon ordre
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: "La date de début doit être antérieure à la date de fin" });
        }

        // Vérifier que le prix est valide
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return res.status(400).json({ message: "Le prix doit être un nombre valide et supérieur à 0" });
        }

        const existingMasterclass = await Masterclass.findOne({ where: { title } });
        if (existingMasterclass) {
            // Supprimer l'image téléchargée
            fs.unlinkSync(`public${imagePath}`);
            return res.status(400).json({ error: "Un cours avec ce nom existe déjà." });
        }

        const masterclass = await Masterclass.create({
            imageUrl: imagePath,
            title,
            description,
            startDate,
            endDate,
            price: parseFloat(price),
        });

        res.status(201).json(masterclass);
    } catch (error) {
        console.error("Erreur lors de la création de la masterclass :", error);
        res.status(500).json({ message: "Erreur lors de la création de la masterclass" });
    }
};

export const getMasterclassById = async (req, res) => {
    try {
        const { id } = req.params;
        const masterclass = await Masterclass.findOne({
            where: { id },
        });

        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass introuvable" });
        }

        res.status(200).json(masterclass);
    } catch (error) {
        console.error("Erreur lors de la récupération du masterclass :", error);
        res.status(500).json({ message: "Erreur lors de la récupération du masterclass" });
    }
};

export const updateMasterclass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, price, duration, maxParticipants, slug } = req.body;

        // Vérification des champs obligatoires
        if (!title || !description || !startDate || !endDate || !price || !duration || !maxParticipants) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const masterclass = await Masterclass.findByPk(id);
        if (!masterclass) {
            if (req.file) {
                fs.unlinkSync(`public/uploads/images/${req.file.filename}`);
            }
            return res.status(404).json({ error: "Masterclass non trouvé" });
        }

        // Regénérer le slug si le titre a changé
        let newSlug = slug || masterclass.slug;
        if (title !== masterclass.title) {
            newSlug = slugify(title, {
                lower: true,
                strict: true,
                locale: "fr",
            });
        }

        let imagePath = masterclass.imageUrl;
        if (req.file) {
            imagePath = `/uploads/images/${req.file.filename}`;
            // Supprimer l'ancienne image si elle existe
            if (masterclass.imageUrl && fs.existsSync(`public${masterclass.imageUrl}`)) {
                fs.unlinkSync(`public${masterclass.imageUrl}`);
            }
        }

        const updatedMasterclass = await masterclass.update(
            {
                title,
                description,
                startDate,
                endDate,
                price: parseFloat(price),
                imageUrl: imagePath,
                duration,
                maxParticipants,
                slug: newSlug,
            },
            {
                where: { id },
                returning: true,
            }
        );

        res.status(200).json({ message: "Masterclass mis à jour avec succès", result: updatedMasterclass });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du masterclass :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du masterclass" });
    }
};

export const getMasterclassBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const masterclass = await Masterclass.findOne({
            where: { slug },
        });

        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass non trouvé" });
        }

        res.status(200).json(masterclass);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la masterclass" });
    }
};

export const deleteMasterclass = async (req, res) => {
    try {
        const { id } = req.params;
        const masterclass = await Masterclass.findByPk(id);
        if (!masterclass) {
            return res.status(404).json({ message: "Masterclass introuvable" });
        }

        await masterclass.destroy();

        res.status(200).json({ message: "Masterclass supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du masterclass :", error);
        res.status(500).json({ message: "Erreur lors de la suppression du masterclass" });
    }
};
