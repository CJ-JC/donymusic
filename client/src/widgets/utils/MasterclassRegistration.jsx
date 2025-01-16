import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { handleCheckout } from "./PaymentService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MasterclassRegistration = ({ endDate, handleCheckoutClick }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      const end = new Date(endDate);
      setIsExpired(now > end); // Met à jour l'état si la date est passée
    };

    checkExpiration(); // Vérifie immédiatement

    const timer = setInterval(checkExpiration, 1000); // Vérifie toutes les secondes

    return () => clearInterval(timer); // Nettoyage
  }, [endDate]);

  return (
    <div className="text-center">
      <Button
        size="md"
        disabled={isExpired}
        className="w-full dark:bg-white dark:text-black dark:hover:bg-gray-400"
        onClick={handleCheckoutClick}
      >
        {isExpired ? "Inscription fermée" : "S'inscrire à la masterclass"}
      </Button>
    </div>
  );
};

export default MasterclassRegistration;
