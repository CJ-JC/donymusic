import Stripe from "stripe";
import { Course } from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import { Payment } from "../models/Payment.js";
import { Category } from "../models/Category.js";
import dotenv from "dotenv";
import { Masterclass } from "../models/Masterclass.js";
import { User } from "../models/User.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                {
                    model: Course,
                    as: "course",
                    required: false,
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: ["id", "title"],
                        },
                    ],
                },
                {
                    model: User,
                    as: "user",
                    required: false,
                },
                {
                    model: Masterclass,
                    as: "masterclass",
                    required: false,
                },
            ],
        });

        res.status(200).json(purchases);
    } catch (error) {
        console.error("Erreur lors de la récupération des achats :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des achats" });
    }
};

export const getUserPurchases = async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non connecté" });
        }

        // Récupérer les achats de l'utilisateur connecté
        const purchases = await Purchase.findAll({
            where: { userId },
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title", "description", "imageUrl"],
                },
                {
                    model: Masterclass,
                    as: "masterclass",
                    attributes: ["id", "title", "description", "imageUrl"],
                },
            ],
        });

        res.status(200).json({ purchases });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la récupération des achats." });
    }
};

export const checkUserPurchase = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.query;

        const purchase = await Purchase.findOne({
            where: { userId, itemId: id, itemType: "course", status: "completed" },
        });

        if (purchase) {
            return res.status(200).json({ hasPurchased: true });
        }

        return res.status(200).json({ hasPurchased: false });
    } catch (error) {
        return res.status(500).json({ error: "Erreur interne" });
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { courseId, courseName, coursePrice, courseSlug, courseImageUrl, masterclassId, masterclassName, masterclassPrice, masterclassSlug, masterclassImageUrl } = req.body;

        const userId = req.user.id;

        // Déterminer si l'utilisateur achète un cours ou une masterclass
        const isMasterclass = !!masterclassId;

        const productName = isMasterclass ? masterclassName : courseName;
        const productPrice = isMasterclass ? masterclassPrice : coursePrice;
        const productSlug = isMasterclass ? masterclassSlug : courseSlug;
        const productImageUrl = isMasterclass ? masterclassImageUrl : courseImageUrl;
        const itemId = isMasterclass ? masterclassId : courseId;

        // Créer une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: productName,
                            images: ["https://donymusic.fr" + productImageUrl],
                        },
                        unit_amount: productPrice,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/detail/slug/${productSlug}`,
            metadata: {
                itemId: itemId,
                userId: userId,
                type: isMasterclass ? "masterclass" : "course",
            },
        });

        // Créer un enregistrement d'achat en attente
        const purchase = await Purchase.create({
            userId: userId,
            itemId: itemId,
            itemType: isMasterclass ? "masterclass" : "course",
            status: "pending",
            amount: productPrice / 100,
        });

        // Créer un enregistrement de paiement en attente
        await Payment.create({
            purchaseId: purchase.id,
            paymentMethod: "credit_card",
            transactionId: session.id,
            amount: productPrice / 100,
            status: "pending",
        });

        res.json({
            id: session.id,
            url: session.url,
        });
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la création de la session de paiement",
            details: error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.query;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const payment = await Payment.findOne({
                where: { transactionId: sessionId },
                include: [
                    {
                        model: Purchase,
                        as: "purchase",
                        include: [
                            {
                                model: Course, // Assurez-vous de gérer les deux modèles (Course et Masterclass)
                                as: session.metadata.type === "masterclass" ? "masterclass" : "course",
                            },
                        ],
                    },
                ],
            });

            if (payment && payment.purchase) {
                res.json({
                    success: true,
                    item: payment.purchase.course || payment.purchase.masterclass,
                });
            } else {
                res.status(404).json({ error: "Paiement non trouvé" });
            }
        } else {
            res.status(400).json({ error: "Le paiement n'a pas été effectué" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la vérification du paiement" });
    }
};
