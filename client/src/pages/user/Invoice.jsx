import React from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const Invoice = ({ purchases }) => {
  const navigate = useNavigate();

  const viewInvoice = (purchase) => {
    navigate("/invoice-pdf", { state: { purchase } });
  };

  return (
    <div className="container mx-auto overflow-auto bg-white">
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
                Action
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
                  {purchase.itemType === "course"
                    ? purchase.course.title
                    : purchase.masterclass.title}
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
                <button
                  onClick={() => viewInvoice(purchase)}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-gray-900 hover:underline"
                >
                  <Eye className="h-5 w-5" />
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
