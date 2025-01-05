// import sequelize from "./config/dbMysql.js";
// import { Masterclass } from "./models/Masterclass.js";

// const seedMasterclasses = async () => {
//     try {
//         // Connect to database
//         await sequelize.authenticate();
//         console.log("Database connected!");

//         // Clear existing masterclasses
//         await Masterclass.destroy({ where: {}, truncate: true });

//         // Sample data
//         const masterclasses = [
//             {
//                 title: "Maîtrisez le Piano",
//                 description: "Apprenez les bases et les techniques avancées du piano avec un expert.",
//                 startDate: "2024-01-15T18:00:00",
//                 endDate: "2024-01-22T18:00:00",
//                 price: 199.99,
//                 duration: 7, // en jours
//                 maxParticipants: 50,
//                 imageUrl: "https://example.com/images/piano-masterclass.jpg",
//             },
//             {
//                 title: "Techniques de Guitare",
//                 description: "Explorez les styles modernes et classiques de la guitare avec un maître.",
//                 startDate: "2024-01-20T10:00:00",
//                 endDate: "2024-01-25T18:00:00",
//                 price: 149.99,
//                 duration: 5, // en jours
//                 maxParticipants: 30,
//                 imageUrl: "https://example.com/images/guitar-masterclass.jpg",
//             },
//             {
//                 title: "Chant pour Débutants",
//                 description: "Découvrez les bases du chant et améliorez votre voix avec des techniques vocales efficaces.",
//                 startDate: "2024-02-01T14:00:00",
//                 endDate: "2024-02-05T17:00:00",
//                 price: 99.99,
//                 duration: 4, // en jours
//                 maxParticipants: 40,
//                 imageUrl: "https://example.com/images/singing-masterclass.jpg",
//             },
//         ];

//         // Insert masterclasses
//         for (const masterclassData of masterclasses) {
//             await Masterclass.create(masterclassData);
//         }

//         console.log("Masterclasses have been seeded!");
//         process.exit(0);
//     } catch (error) {
//         console.error("Error seeding masterclasses:", error);
//         process.exit(1);
//     }
// };

// seedMasterclasses();
