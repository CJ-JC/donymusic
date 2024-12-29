import sequelize from "./config/dbMysql.js"; // Chemin vers votre fichier de config Sequelize
import { Remise } from "./models/Remise.js"; // Chemin vers votre modèle Remise

async function createRemises() {
    try {
        // Synchronisation avec la base de données (optionnel si déjà synchronisé ailleurs)
        await sequelize.authenticate();

        await sequelize.sync(); // Crée les tables si elles n'existent pas

        // Création des Remises
        await Remise.create({
            discountPercentage: 10,
            isGlobal: true,
            expirationDate: new Date("2024-12-31"),
        });

        await Remise.create({
            discountPercentage: 20,
            isGlobal: false,
            courseId: 1, // ID d'un cours spécifique
            expirationDate: new Date("2024-12-31"),
        });
    } catch (error) {
        console.error("Erreur lors de la création des Remises :", error);
    } finally {
        await sequelize.close();
    }
}

// Exécution du script
createRemises();
