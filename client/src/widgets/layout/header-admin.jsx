import { Euro, Eye, ShoppingBag, ShoppingCart, Users2 } from "lucide-react";
import React from "react";

const HeaderAdmin = ({ users, purchases, totalBenefits }) => {
  const formattedNumber = users.length.toLocaleString("fr-FR");
  const formattedNumberPurchases = purchases.length.toLocaleString("fr-FR");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
      <div className="rounded-sm bg-white px-7 py-6 shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121]">
          <ShoppingCart className="h-5 w-5 text-white" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold dark:text-white">
              {formattedNumberPurchases}
            </h4>
            <span className="text-sm font-medium text-blue-gray-700">
              Nombre de commandes
            </span>
          </div>

          <span className="text-meta-3 flex items-center gap-1 text-sm font-medium">
            0.43%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div className="rounded-sm bg-white px-7 py-6 shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121]">
          <Euro className="h-5 w-5 text-white" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold dark:text-white">
              {totalBenefits.toFixed(2)}€
            </h4>
            <span className="text-sm font-medium text-blue-gray-700">
              Total des bénéfices
            </span>
          </div>

          <span className="text-meta-3 flex items-center gap-1 text-sm font-medium">
            4.35%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div className="rounded-sm bg-white px-7 py-6 shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121]">
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold dark:text-white">2.450</h4>
            <span className="text-sm font-medium text-blue-gray-700">
              Total Product
            </span>
          </div>

          <span className="text-meta-3 flex items-center gap-1 text-sm font-medium">
            2.59%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>
      </div>

      <div className="rounded-sm bg-white px-7 py-6 shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#212121]">
          <Users2 className="h-5 w-5 text-white" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold dark:text-white">
              {formattedNumber}
            </h4>
            <span className="text-sm font-medium text-blue-gray-700">
              Total Users
            </span>
          </div>

          <span className="text-meta-5 flex items-center gap-1 text-sm font-medium">
            0.95%
            <svg
              className="fill-meta-5"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
