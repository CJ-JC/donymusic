import multer from "multer";
import path from "path";

// Configuration de stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads"); // Dossier de destination
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extension du fichier
        cb(null, `${Date.now()}-${file.originalname}`); // Nom unique
    },
});

// Vérification du type de fichier
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier invalide. Seules les images sont autorisées."), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
