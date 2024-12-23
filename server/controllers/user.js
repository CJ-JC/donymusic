import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
    const email = req.body.email.toLowerCase();

    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifiez si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé" });
        }

        // Créez l'utilisateur
        const user = await User.create({ firstName, lastName, email, password });

        // Masquer le mot de passe dans la réponse
        const { id, createdAt, updatedAt } = user;
        res.status(201).json({ id, firstName, lastName, email, createdAt, updatedAt });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

export const loginUser = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        res.status(200).json({ message: "Connexion réussie", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};
