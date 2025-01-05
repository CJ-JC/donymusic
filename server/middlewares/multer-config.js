import multer from "multer";
import path from "path";

// Configuration de stockage dynamique
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
        const uploadDir = isImage ? "public/uploads/images" : "public/uploads/attachments";
        cb(null, uploadDir); // Dossier de destination basé sur le type de fichier
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extension du fichier
        cb(null, `${Date.now()}-${file.originalname}`); // Nom unique
    },
});

// Vérification du type de fichier
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedAttachmentTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

    if (allowedImageTypes.includes(file.mimetype) || allowedAttachmentTypes.includes(file.mimetype)) {
        cb(null, true); // Accepter le fichier
    } else {
        cb(new Error("Type de fichier invalide. Seules les images et certains fichiers sont autorisés."), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
