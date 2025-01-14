import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { handleCheckout } from "./PaymentService";

const MasterclassRegistration = ({ endDate }) => {
  const [isExpired, setIsExpired] = useState(false);
  const [masterclass, setMasterclass] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`/api/masterclass/slug/${id}`);
        setMasterclass(response.data);
        setAuthLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération du cours");
      }
    };
    fetchMasterclass();
  }, [authLoading]);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        if (masterclass) {
          const response = await axios.get(
            `/api/payment/check-purchase?id=${masterclass.id}`,
            {
              withCredentials: true,
            },
          );

          setHasPurchased(response.data.hasPurchased);
        }
      } catch (error) {
        setError("Erreur lors de la vérification de l'achat:", error);
      }
    };
    checkPurchase();
  }, [masterclass]);

  const handleCheckoutClick = () => {
    handleCheckout({
      course,
      isLoggedIn,
      navigate,
      setError,
    });
  };

  return (
    <div className="text-center">
      <Button
        variant="gradient"
        size="md"
        disabled={isExpired}
        className="w-full"
        onClick={handleCheckoutClick}
      >
        {isExpired ? "Inscription fermée" : "S'inscrire à la masterclass"}
      </Button>
    </div>
  );
};

export default MasterclassRegistration;
