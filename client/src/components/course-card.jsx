import { Link } from "react-router-dom";
import { BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseProgress from "@/widgets/utils/Course-progress";

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  slug,
  discountedPrice,
  category,
}) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [color, setColor] = useState("#FF6C02");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPurchase = async () => {
      try {
        const response = await axios.get(
          `/api/payment/check-purchase?id=${id}`,
          {
            withCredentials: true,
          },
        );
        setHasPurchased(response.data.hasPurchased);
      } catch (error) {
        setError("Erreur lors de la vérification de l'achat:", error);
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await axios.get(`/api/user-progress/${id}`, {
          withCredentials: true,
        });
        setProgress(response.data.progress);
      } catch (error) {
        setError("Erreur lors de la récupération de la progression:", error);
      }
    };

    checkPurchase();
    fetchProgress();
  }, [id]);

  useEffect(() => {
    if (category === "Piano") {
      setColor("crimson");
    } else if (category === "Guitare") {
      setColor("#023047");
    } else if (category === "Batterie") {
      setColor("#2d6a4f");
    } else {
      setColor("#FF6C02");
    }
  }, [category]);

  return (
    <>
      <Link to={`/detail/slug/${slug}`} key={id}>
        <article className="pt-30 relative isolate mx-auto flex h-72 max-w-sm flex-col justify-end overflow-hidden rounded-2xl px-4 pb-4">
          <img
            alt={title}
            src={`${BASE_URL}${imageUrl}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {progress === 100 && (
            <div className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Trophy className="text-xl text-[#ffd700]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80"></div>
          <h3 className="z-10 text-xl font-medium text-white">{title}</h3>
          <div className="z-10 my-2 flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-full bg-light-blue-50 p-1">
              <BookOpen className="text-green-500" />
            </div>
            <span className="text-white">
              {chaptersLength > 1
                ? `${chaptersLength} Chapitres`
                : `${chaptersLength} Chapitre`}
            </span>
          </div>
          {hasPurchased ? (
            <CourseProgress size="sm" value={progress} />
          ) : (
            <p className="text-md z-10 font-medium text-white md:text-sm">
              {!hasPurchased &&
                (discountedPrice && discountedPrice < price ? (
                  <>
                    <span className="text-lg text-gray-300 line-through">
                      {price}€
                    </span>
                    <span className="ml-2 text-lg text-white">
                      {discountedPrice}€
                    </span>
                  </>
                ) : (
                  <span className="text-lg text-white">{price}€</span>
                ))}
            </p>
          )}
          <span
            style={{ backgroundColor: color, display: "block" }}
            className={`absolute bottom-5 right-0 mr-3 mt-3 rounded-full px-2 py-1 text-sm text-white`}
          >
            {category}
          </span>
        </article>
      </Link>
    </>
  );
};

export default CourseCard;
