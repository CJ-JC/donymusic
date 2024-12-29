import React, { useEffect, useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Loading from "@/widgets/utils/Loading";
import ReactQuill from "react-quill";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const detail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState();
  const [showImage, setShowImage] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [availableRemises, setAvailableRemises] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/course/slug/${id}`);
        setCourse(response.data);
        setAuthLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération du cours");
      }
    };
    fetchCourse();
  }, [authLoading]);

  useEffect(() => {
    const fetchRemise = async () => {
      try {
        const remiseResponse = await axios.get(`/api/remise/course/slug/${id}`);
        const remises = remiseResponse.data;

        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          setGlobalDiscount(globalRemise.discountPercentage);
        }

        const specificRemises = remises.filter((remise) => !remise.isGlobal);
        setAvailableRemises(specificRemises);
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    const fetchRemises = async () => {
      try {
        const response = await axios.get("/api/remise");
        const remises = response.data;

        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          setGlobalDiscount(globalRemise.discountPercentage);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    fetchRemises();
    fetchRemise();
  }, [id]);

  useEffect(() => {
    if (course) {
      let finalDiscountedPrice = course.price;
      let appliedDiscountPercentage = null;

      // Appliquer la remise globale
      if (globalDiscount) {
        finalDiscountedPrice -= (finalDiscountedPrice * globalDiscount) / 100;
        appliedDiscountPercentage = globalDiscount;
      }

      // Appliquer la remise spécifique pour le cours
      const specificRemise = availableRemises.find(
        (remise) => remise.courseId === course.id,
      );

      if (specificRemise) {
        finalDiscountedPrice -=
          (course.price * specificRemise.discountPercentage) / 100;
        appliedDiscountPercentage = specificRemise.discountPercentage;
      }

      // Mettre à jour le prix final et le pourcentage de réduction
      setDiscountedPrice(parseFloat(finalDiscountedPrice).toFixed(2));
      setDiscountPercentage(appliedDiscountPercentage);
    }
  }, [course, globalDiscount, availableRemises]);

  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleVideoError = () => {
    setShowImage(true);
  };

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto my-6 max-w-screen-xl px-2">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="order-1 col-span-1 flex flex-col space-y-6 lg:col-span-3">
          <div className="overflow-hidden rounded-md border p-2">
            <div className="relative aspect-video overflow-hidden">
              {showImage || !course.videoUrl ? (
                <img
                  src={
                    course.image || `http://localhost:8001${course.imageUrl}`
                  }
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Vimeo
                  video={course.videoUrl}
                  responsive={true}
                  autoplay={false}
                  onError={handleVideoError}
                />
              )}
            </div>
          </div>
          <div className="relative rounded-md border p-3">
            <div className="mb-3 flex items-center justify-between gap-x-2">
              <h2 className="text-xl font-bold md:text-2xl">{course.title}</h2>
              <div className="focus:ring-ring inline-flex items-center rounded-md border border-transparent bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open mr-2 h-4 w-4"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>
                  {course.chapters.length}{" "}
                  {course.chapters.length === 1 ? "chapitre" : "chapitres"}
                </span>
              </div>
            </div>

            <div className="text-md my-3 text-blue-gray-500">
              <ReactQuill
                value={course.description}
                readOnly={true}
                theme="bubble"
              />
            </div>
            {course.chapters && course.chapters.length > 0 && (
              <>
                <h2 className="my-6 text-xl font-bold md:text-2xl">
                  Contenu du cours
                </h2>

                <p className="text-md border-b border-gray-300 py-1">
                  {course.chapters.length}{" "}
                  {course.chapters.length === 1 ? "chapitre" : "chapitres"}
                </p>
                <div className="mt-4">
                  {course.chapters.map((chapter) => (
                    <Accordion
                      key={chapter.id}
                      open={open === chapter.id}
                      icon={<Icon id={chapter.id} open={open} />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpen(chapter.id)}
                        className="text-lg font-bold"
                      >
                        {chapter.title}
                      </AccordionHeader>
                      <AccordionBody className="p-0">
                        {chapter.videos && chapter.videos.length > 0 && (
                          <ul className="space-y-2">
                            {chapter.videos.map((video) => (
                              <li key={video.id}>
                                <button className="my-1 flex w-full items-center gap-x-2 bg-gray-100 p-1 text-sm font-bold transition hover:bg-gray-200">
                                  {video.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </AccordionBody>
                    </Accordion>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* <div className="order-2 flex flex-col space-y-6 lg:col-span-2">
          <div className="rounded-md border p-6">
            <div className="mb-7">
              <h4 className="mb-4 text-xl font-semibold text-blue-gray-900">
                Continuez là où vous vous êtes arrêté.
              </h4>

              <p className="text-sm text-blue-gray-900">
                Regardez à partir du dernier chapitre terminé.
              </p>
            </div>
            <Link
              to={`/course-player/course/${course.id}/chapters/${course.chapters[0].id}`}
              className="rounded-full"
            >
              <Button
                variant="gradient"
                className="flex w-full items-center justify-center transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play-circle mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Visionner
              </Button>
            </Link>
          </div>
        </div> */}

        <div className="order-2 flex flex-col space-y-6 lg:col-span-2">
          <div className="rounded-md border p-3">
            <div className="mb-7">
              <h4 className="mb-4 text-xl font-semibold text-blue-gray-900">
                Payer la formation
              </h4>
              <p className="text-sm text-blue-gray-900">
                Cliquez sur le bouton ci-dessous pour procéder au paiement de la
                formation.
              </p>
            </div>
            <Link
              to={`/course-player/course/${course.id}/chapters/${course.chapters[0].id}`}
              className="rounded-full"
            >
              <Button
                variant="gradient"
                className="flex w-full items-center justify-center transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play-circle mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Visionner
              </Button>
            </Link>
            <div className="space-y-6">
              <div className="flex items-center gap-x-4">
                {discountedPrice && discountedPrice < course.price ? (
                  <>
                    <span className="text-lg font-bold text-blue-gray-900 line-through">
                      {course.price}€
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {discountedPrice}€
                    </span>
                    <span className="text-sm text-green-600">
                      ({discountPercentage}% de réduction)
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-blue-gray-900">
                    {course.price}€
                  </span>
                )}
              </div>
              <div>
                <Link
                  to={`/payment/course/${course.id}`}
                  className="mt-5 rounded-full"
                >
                  <Button
                    variant="gradient"
                    className="flex w-full items-center justify-center transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-credit-card mr-2 h-4 w-4"
                    >
                      <rect
                        x="1"
                        y="4"
                        width="22"
                        height="16"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Payer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default detail;
