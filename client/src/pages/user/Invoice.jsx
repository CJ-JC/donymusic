import React from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Invoice = ({ purchases }) => {
  const navigate = useNavigate();

  const viewInvoice = (purchase) => {
    navigate("/invoice-pdf", { state: { purchase } });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Vos achats", 10, 10);
    purchases.forEach((purchase, index) => {
      doc.text(
        `${purchase.course.title} - ${purchase.amount}€`,
        10,
        20 + index * 10,
      );
    });
    doc.save("facture.pdf");
  };

  return (
    <div className="container mx-auto bg-white">
      <Typography variant="h4">Vos achats</Typography>
      <p className="text-gray-600">
        Les offres que vous avez achetées sont affichées ci-dessous.
      </p>
      <table className="my-4 w-full min-w-max table-auto text-left">
        <thead className="bg-[#F9FAFB] text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Produit
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Montant
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Statut
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Acheté le
              </p>
            </th>
            <th className="border-slate-200 bg-slate-50 border-b p-4">
              <p className="text-slate-500 text-sm font-normal leading-none">
                Action sur la facture
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase, index) => (
            <tr
              className="hover:bg-slate-50 border-slate-200 border-b"
              key={index}
            >
              <td className="p-4 py-5">
                <p className="text-slate-800 block text-sm">
                  {purchase.course.title}
                </p>
              </td>
              <td className="p-4 py-5">
                <p className="text-slate-500 text-sm">{purchase.amount}€</p>
              </td>
              <td className="p-4 py-5">
                <p className="text-slate-500 text-sm">
                  {purchase.status === "pending" ? (
                    <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      En attente
                    </span>
                  ) : (
                    <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                      Acheté
                    </span>
                  )}
                </p>
              </td>
              <td className="p-4 py-5">
                {new Date(purchase.createdAt).toLocaleDateString()}
              </td>
              <td className="flex items-center gap-4 p-4 py-5">
                {/* Télécharger */}
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                  Télécharger
                </button>

                {/* Voir */}
                <button
                  onClick={() => viewInvoice(purchase)}
                  className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553 2.276A1 1 0 0120 13.118V18a1 1 0 01-1 1H5a1 1 0 01-1-1v-4.882a1 1 0 01.447-.842L9 10m6 0V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v4m6 0H9"
                    />
                  </svg>
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
