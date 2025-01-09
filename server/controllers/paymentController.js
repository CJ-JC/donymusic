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
        console.error("Erreur lors de la vérification de l'achat:", error);
        return res.status(500).json({ error: "Erreur interne" });
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { courseId, courseName, coursePrice, courseSlug, courseImageUrl } = req.body;
        const userId = req.user.id;

        // Créer une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: courseName,
                            images: ["https://donymusic.fr" + courseImageUrl],
                        },
                        unit_amount: coursePrice,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/detail/slug/${courseSlug}`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
        });

        // Créer un enregistrement d'achat en attente
        const purchase = await Purchase.create({
            userId: userId,
            itemId: courseId,
            itemType: "course",
            status: "pending",
            amount: coursePrice / 100,
        });

        // Créer un enregistrement de paiement en attente
        await Payment.create({
            purchaseId: purchase.id,
            paymentMethod: "credit_card",
            transactionId: session.id,
            amount: coursePrice / 100,
            status: "pending",
        });

        // S'assurer que l'ID de session est bien envoyé
        res.json({
            id: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error("Erreur détaillée:", error);
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
                                model: Course,
                                as: "course",
                            },
                        ],
                    },
                ],
            });

            if (payment && payment.purchase) {
                res.json({
                    success: true,
                    course: payment.purchase.course,
                });
            } else {
                res.status(404).json({ error: "Paiement non trouvé" });
            }
        } else {
            res.status(400).json({ error: "Le paiement n'a pas été effectué" });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
        res.status(500).json({ error: "Erreur lors de la vérification du paiement" });
    }
};
