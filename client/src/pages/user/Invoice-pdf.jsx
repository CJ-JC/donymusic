import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { ArrowBack } from "@mui/icons-material";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import axios from "axios";

const InvoicePdf = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(`/api/user/profile/${user.id}`);
        setData(response.data);
      } catch (error) {
        setError({
          type: "error",
          content:
            error.response?.data?.message ||
            "Erreur lors de la récupération des données",
        });
      }
    };

    fetchUserData();
  }, [isLoggedIn, user]);

  const { state } = useLocation();
  const { purchase } = state;

  const openPDF = () => {
    const doc = new jsPDF();

    // Marges et variables pour positionner les éléments
    const marginLeft = 10;
    let currentY = 20;

    // Titre de la facture
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Facture", marginLeft, currentY);
    currentY += 10;

    // Date de la facture
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date : ${new Date(purchase.createdAt).toLocaleDateString()}`,
      marginLeft,
      currentY,
    );
    currentY += 10;

    // Informations sur l'acheteur
    doc.setFont("helvetica", "bold");
    doc.text(
      `Facturé à : ${data?.firstName} ${data?.lastName}`,
      marginLeft,
      currentY,
    );
    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Email : ${data?.email}`, marginLeft, currentY);
    currentY += 40;

    // Table des produits
    doc.setFont("helvetica", "bold");
    doc.text("Produit", marginLeft, currentY);
    doc.text("Montant HT", marginLeft + 60, currentY);
    doc.text("TVA (20%)", marginLeft + 120, currentY);
    doc.text("Montant TTC", marginLeft + 165, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.line(marginLeft, currentY, marginLeft + 190, currentY); // Ligne horizontale
    currentY += 6;

    // Ajouter le produit acheté
    const montantHT = (purchase.amount / 1.2).toFixed(2);
    const montantTVA = (purchase.amount - purchase.amount / 1.2).toFixed(2);
    const montantTTC = purchase.amount;

    doc.text(
      `${
        purchase.itemType === "course"
          ? purchase.course.title
          : purchase.masterclass.title
      }`,
      marginLeft,
      currentY,
    );
    doc.text(`${montantHT}€`, marginLeft + 60, currentY);
    doc.text(`${montantTVA}€`, marginLeft + 120, currentY);
    doc.text(`${montantTTC}€`, marginLeft + 175, currentY);
    currentY += 10;

    // Total de la facture
    doc.setFont("helvetica", "bold");
    doc.text("Total HT :", marginLeft + 120, currentY);
    doc.text(`${montantHT}€`, marginLeft + 175, currentY);
    currentY += 6;
    doc.text("TVA (20%) :", marginLeft + 120, currentY);
    doc.text(`${montantTVA}€`, marginLeft + 175, currentY);
    currentY += 6;
    doc.text("Total TTC :", marginLeft + 120, currentY);
    doc.text(`${montantTTC}€`, marginLeft + 175, currentY);

    // Ajouter les informations de l'entreprise au pied de page
    const footerY = 290;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Entreprise XYZ | Adresse : 123 Rue de l'Exemple, 75000 Paris, France",
      marginLeft,
      footerY,
    );
    doc.text(
      "SIRET : 123 456 789 00012 | TVA : FR 12 3456789012",
      marginLeft,
      footerY + 5,
    );
    doc.text(
      "Email : contact@entreprisexyz.fr | Téléphone : +33 1 23 45 67 89",
      marginLeft,
      footerY + 10,
    );

    // Générer et ouvrir le PDF
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
  };

  return (
    <div className="h-auto md:h-screen">
      <div className="mx-auto my-5 max-w-3xl rounded-lg bg-white p-6 shadow-md">
        {/* Header Section */}
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
              Facture
            </h1>
            <p className="text-gray-600">
              Numéro de Facture : #{purchase.id.toString().padStart(6, "0")}
            </p>
            <p className="text-gray-600">
              Date : {new Date(purchase.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-md font-semibold text-gray-800 md:text-xl">
              Facturé à {data?.firstName} {data?.lastName}
            </h2>
            <p className="text-gray-600">Email : {data?.email}</p>
          </div>
        </div>

        {/* Products Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-600">Produit</th>
                <th className="px-4 py-2 text-right text-gray-600">
                  Montant HT
                </th>
                <th className="px-4 py-2 text-right text-gray-600">
                  TVA (20%)
                </th>
                <th className="px-4 py-2 text-right text-gray-600">
                  Montant TTC
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-gray-700">
                  {purchase.itemType === "course"
                    ? purchase.course.title
                    : purchase.masterclass.title}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {(purchase.amount / 1.2).toFixed(2)}€
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {(purchase.amount - purchase.amount / 1.2).toFixed(2)}€
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {purchase.amount}€
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="my-3 h-80 text-right md:text-center lg:text-right">
          <p className="text-md font-semibold text-gray-800">
            Total HT : {(purchase.amount / 1.2).toFixed(2)}€
          </p>
          <p className="text-md font-semibold text-gray-800">
            TVA (20%) : {(purchase.amount - purchase.amount / 1.2).toFixed(2)}€
          </p>
          <p className="text-lg font-bold text-gray-800">
            Total TTC : {purchase.amount}€
          </p>
        </div>

        {/* Footer Section */}
        <div className="my-6">
          {/* Company Info */}
          <div className="border-t pt-4">
            <h2 className="text-md font-semibold text-gray-800">
              Informations de l'entreprise
            </h2>
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-between">
              <div className="flex flex-col">
                <p className="text-gray-600">Donymsic</p>
                <p className="text-gray-600">
                  <strong>Adresse : </strong>123 Rue Exemple
                </p>
                <p className="text-gray-600">75001 Paris, France</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-600">
                  <strong>Siret :</strong> 123 456 789 00012
                </p>
                <p className="text-gray-600">
                  <strong>Tva :</strong> FR12345678901
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr />
        {/* Actions */}
        <div className="mt-6 flex items-center justify-center space-x-3">
          <Link to={"/user/account"} className="flex items-center gap-x-2">
            <Button variant="outlined" color="gray" size="sm">
              <ArrowBack />
              Retour
            </Button>
          </Link>
          <Button onClick={openPDF} variant="gradient" className="text-white">
            Ouvrir la facture en PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePdf;
