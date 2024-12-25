import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const CourseCard = ({ id, title, imageUrl, chaptersLength, price, slug }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80"></div>
          <h3 className="z-10 text-xl font-medium text-white">{title}</h3>
          <div className="z-10 my-2 flex space-x-2">
            <BookOpen className="mr-2 h-6 w-6 rounded-full bg-white p-0.5 text-green-700" />
            <span className="text-white">
              {chaptersLength.length > 1
                ? chaptersLength + " Chapitres"
                : chaptersLength + " Chapitre"}
            </span>
          </div>
          <span className="absolute bottom-5 right-0 mr-3 mt-3 rounded-full px-2 py-1 text-sm text-white">
            {price}€
          </span>
        </article>
      </Link>
    </>
  );
};

export default CourseCard;
