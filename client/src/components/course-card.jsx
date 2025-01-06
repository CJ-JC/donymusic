import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

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
            style={{
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* {progress === 100 && (
                        <div className="absolute top-3 right-3 w-10 h-10 bg-white z-10 rounded-full flex justify-center items-center">
                            <FaTrophy className="text-gold text-xl" />
                        </div>
                    )} */}
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
          <p className="text-md z-10 font-medium text-white md:text-sm">
            {discountedPrice && discountedPrice < price ? (
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
            )}
          </p>
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
