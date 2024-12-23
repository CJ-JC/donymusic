import React from "react";
import CategoryItem from "./category-item";

const Categories = ({ items }) => {
  // Map des icônes associées aux catégories
  const iconMap = {
    Guitare: "/img/guitare.svg",
    Batterie: "/img/batterie.svg",
    Basse: "/img/basse.svg",
    Piano: "/img/piano.svg",
  };

  return (
    <div className="flex items-center gap-x-4 overflow-x-auto pb-2 lg:justify-center">
      {items.map((item) => (
        <CategoryItem
          icon={iconMap[item.name]}
          key={item.id}
          value={item.id}
          label={item.name}
        />
      ))}
    </div>
  );
};

// Validation des props (optionnelle)
// Category.defaultProps = {
//   items: [],
// };

export default Categories;
