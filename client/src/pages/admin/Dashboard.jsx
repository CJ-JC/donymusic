import HeaderAdmin from "@/widgets/layout/header-admin";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");
  const [totalBenefits, setTotalBenefits] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user");
        setUsers(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get("/api/payment/get-purchases");
        setPurchases(response.data);
        const completedPurchases = response.data.filter(
          (purchase) => purchase.status === "completed",
        );

        const total = completedPurchases.reduce(
          (acc, purchase) => acc + purchase.amount,
          0,
        );

        setTotalBenefits(total);
      } catch (error) {
        setError("Erreur lors de la récupération des achats :", error);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <>
      <HeaderAdmin
        users={users}
        purchases={purchases}
        totalBenefits={totalBenefits}
      />
      <div className="py-3">
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        <div className="relative my-3 flex w-full flex-col overflow-scroll rounded-lg bg-white bg-clip-border p-4 text-gray-700 shadow-md">
          <Typography
            variant="h3"
            className="my-3 text-xl font-bold md:text-3xl "
            color="blue-gray"
          >
            Les commandes
          </Typography>
          <table className="w-full min-w-max table-auto text-left">
            <thead className="bg-[#F9FAFB] text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Transaction
                  </p>
                </th>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Produit
                  </p>
                </th>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Catégorie
                  </p>
                </th>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Montant
                  </p>
                </th>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Status
                  </p>
                </th>
                <th className="border-slate-200 bg-slate-50 border-b p-4">
                  <p className="text-slate-500 text-sm font-normal leading-none">
                    Date
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
                      Paiement de{" "}
                      <span className="font-semibold">
                        {purchase.user.firstName} {purchase.user.lastName}
                      </span>
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-slate-800 block text-sm">
                      <span className="font-semibold">
                        {" "}
                        {purchase.course.title}
                      </span>
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-slate-800 block text-sm">
                      {purchase.course.category
                        ? purchase.course.category.title
                        : "Catégorie non définie"}
                    </p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-slate-500 text-sm">
                      {purchase.course.price}€
                    </p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
