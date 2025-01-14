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
    // Nettoyage des champs pour supprimer les espaces superflus
    const firstName = req.body.firstName.trim().replace(/\s+/g, " ");
    const lastName = req.body.lastName.trim().replace(/\s+/g, " ");
    const email = req.body.email.trim().toLowerCase().replace(/\s+/g, "");
    const password = req.body.password.trim();

    // Regex pour valider l'email
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegexp.test(email);

    // Regex pour valider le mot de passe
    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Vérification des champs requis
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification de la longueur du prénom et du nom
    if (firstName.length < 2 || lastName.length < 2) {
        return res.status(400).json({
            message: "Le prénom et le nom doivent contenir au moins 2 caractères.",
        });
    }

    // Vérification de la validité de l'email
    if (!isValidEmail) {
        return res.status(400).json({ message: "L'email est invalide" });
    }

    // Vérification de la validité du mot de passe
    if (!passwordRegexp.test(password)) {
        return res.status(400).json({
            message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        });
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
    const email = req.body.email.trim().toLowerCase().replace(/\s+/g, "");
    const password = req.body.password.trim();

    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegexp.test(email);

    if (!isValidEmail) {
        return res.status(400).json({ message: "L'email est invalide" });
    }

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
    const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, confirmPassword, passwordCurrent } = req.body;

        // les champs sont obligatoires
        if (!firstName || !lastName || !email || !password || !confirmPassword || !passwordCurrent) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Récupérer l'utilisateur à mettre à jour
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Validation de l'email si fourni
        if (email && !emailRegexp.test(email)) {
            return res.status(400).json({ message: "L'email est invalide" });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }
        }

        // Vérification de la modification du mot de passe
        if (password || confirmPassword) {
            if (!passwordCurrent) {
                return res.status(400).json({
                    message: "Le mot de passe actuel est requis pour le modifier.",
                });
            }

            // Vérifier si le mot de passe actuel est correct
            const isPasswordValid = await bcrypt.compare(passwordCurrent, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Le mot de passe actuel est incorrect.",
                });
            }

            // Vérifier si les nouveaux mots de passe correspondent
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Les nouveaux mots de passe ne correspondent pas.",
                });
            }

            // Vérifier la validité du nouveau mot de passe
            if (!passwordRegexp.test(password)) {
                return res.status(400).json({
                    message: "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
                });
            }
        }

        // Hachage du nouveau mot de passe (si renseigné)
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Mise à jour des informations de l'utilisateur
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
