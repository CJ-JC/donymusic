import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const InvoicePdf = () => {
  const { state } = useLocation();
  const { purchase } = state;

  const openPDF = () => {
    const doc = new jsPDF();

    // Définir les marges
    const marginLeft = 10;
    let currentY = 20;

    // Titre de la facture
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Facture", marginLeft, currentY);
    currentY += 10;

    // Date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date : ${new Date(purchase.createdAt).toLocaleDateString()}`,
      marginLeft,
      currentY,
    );
    currentY += 10;

    // Détails facturés
    doc.setFont("helvetica", "bold");
    doc.text("Facturé à :", marginLeft, currentY);
    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`${purchase.user?.name}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Email : ${purchase.user?.email}`, marginLeft, currentY);
    currentY += 10;

    // Table des produits
    doc.setFont("helvetica", "bold");
    doc.text("Produit", marginLeft, currentY);
    doc.text("Montant", marginLeft + 140, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    doc.line(marginLeft, currentY, marginLeft + 190, currentY); // Ligne horizontale
    currentY += 6;

    // Ligne de produit
    doc.text(`${purchase.course.title}`, marginLeft, currentY);
    doc.text(`${purchase.amount}€`, marginLeft + 140, currentY);
    currentY += 10;

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total :", marginLeft + 140, currentY);
    doc.text(`${purchase.amount}€`, marginLeft + 170, currentY);

    // Message de remerciement
    currentY += 20;
    doc.setFont("helvetica", "normal");
    doc.text(
      "Merci pour votre achat ! Si vous avez des questions concernant votre commande,",
      marginLeft,
      currentY,
    );
    currentY += 6;
    doc.text("veuillez nous contacter.", marginLeft, currentY);

    // Générer et ouvrir le PDF
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
  };

  return (
    <div className="h-auto md:h-screen">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Facture</h1>
            <p className="text-gray-600">
              Date : {new Date(purchase.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-800">Facturé à</h2>
            <p className="text-gray-600">{purchase.user?.name}</p>
            <p className="text-gray-600">Email : {purchase.user?.email}</p>
          </div>
        </div>

        <table className="mb-6 w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600">Produit</th>
              <th className="px-4 py-2 text-left text-gray-600">Description</th>
              <th className="px-4 py-2 text-left text-gray-600">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-700">
                {purchase.course.title}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {purchase.course.description}
              </td>
              <td className="px-4 py-2 text-gray-700">{purchase.amount}€</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6">
          <button
            onClick={openPDF}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Ouvrir la facture en PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePdf;
