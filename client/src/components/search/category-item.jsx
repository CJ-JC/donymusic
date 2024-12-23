import React from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import qs from "qs";
import cn from "classnames";

const CategoryItem = ({ label, value, icon }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer les paramètres actuels
  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  // Vérifier si cet élément est sélectionné
  const isSelected = currentCategoryId === value;

  // Gestion du clic pour mettre à jour l'URL
  const handleClick = () => {
    const query = {
      title: currentTitle,
      categoryId: isSelected ? null : value, // Retirer si déjà sélectionné
    };

    const url = qs.stringify(
      {
        url: location.pathname,
        query,
      },
      { skipNulls: true, skipEmptyStrings: true },
    );

    navigate(url);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex min-w-max items-center gap-x-2 rounded-md border px-3 py-2 text-sm font-medium transition hover:shadow-sm",
        {
          "border-sky-800/10 bg-sky-500/10 text-sky-800": isSelected,
          "border-gray-300 text-gray-700 hover:bg-gray-100": !isSelected,
        },
      )}
      type="button"
    >
      {icon && <img src={icon} alt={label} className="h-6 w-6" />}
      <span className="truncate">{label}</span>
    </button>
  );
};

export default CategoryItem;
