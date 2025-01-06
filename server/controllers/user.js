import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

export const registerUser = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { firstName, lastName, password } = req.body;

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifiez si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé" });
        }

        // Hash du mot de passe avec bcrypt
        const saltRounds = 10; // Niveau de complexité
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créez l'utilisateur avec le mot de passe haché
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Masquer le mot de passe dans la réponse
        const { id, createdAt, updatedAt } = user;
        res.status(201).json({ id, firstName, lastName, email, createdAt, updatedAt });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

export const loginUser = async (req, res) => {
    const email = req.body.email.toLowerCase();

    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegexp.test(email);

    if (!isValidEmail) {
        return res.status(400).json({ message: "L'email est invalide" });
    }

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

        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({ message: "Connexion réussie", user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la déconnexion", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }
        }

        // Vérifier si le mot de passe doit être mis à jour
        let hashedPassword;
        if (password) {
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Mise à jour des informations
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email ? email.toLowerCase() : user.email,
            ...(hashedPassword && { password: hashedPassword }),
        });

        // Renvoyer l'utilisateur mis à jour sans le mot de passe
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};
