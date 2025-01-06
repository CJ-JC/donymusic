import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import { Mic, User } from "lucide-react";
import Countdown from "../widgets/utils/Countdown";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import Loading from "@/widgets/utils/Loading";

const MasterClass = () => {
  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        const response = await axios.get(`/api/masterclass`);
        setMasterclasses(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération de la masterclass");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterclass();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-screen-xl py-4">
      {/* Hero Section */}
      {masterclasses.length !== 0 ? (
        <>
          <section className="mb-12 text-center">
            <Typography
              variant="h2"
              color="blue-gray"
              className="mb-6 text-3xl font-extrabold"
            >
              Rejoignez Nos Masterclasses Exclusives
            </Typography>
            <Typography className="text-blue-gray-600">
              Découvrez des cours intensifs dispensés par des professionnels de
              la musique. Améliorez vos compétences et faites passer votre
              talent au niveau supérieur.
            </Typography>
          </section>

          {/* Upcoming Sessions */}
          <section className="mb-12">
            <Typography
              variant="h3"
              color="blue-gray"
              className="mb-6 text-2xl font-bold"
            >
              Prochaines Sessions
            </Typography>
            <div className="grid gap-6 lg:grid-cols-1">
              {masterclasses.map((masterclass, index) => (
                <div className="flex items-start gap-4" key={index}>
                  <div className="hidden flex-col items-center md:flex">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-gray-900 text-2xl text-white">
                      {index + 1}
                    </div>
                    <div className="mt-2 h-56 w-1 bg-gray-500"></div>
                  </div>

                  <Card className="flex-1 bg-gray-50 text-white shadow-md">
                    <CardBody className="flex flex-col items-center gap-6 p-4 md:flex-row">
                      <div className="overflow-hidden rounded-md">
                        <img
                          src={`${BASE_URL}${masterclass.imageUrl}`}
                          alt={`${masterclass.title}`}
                          className="h-[250px] w-[350px] rounded-lg object-cover"
                        />
                      </div>
                      <div className="w-full">
                        <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row">
                          <div>
                            <div className="flex flex-col gap-2 px-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-blue-gray-900">
                                  Début :
                                </span>
                                <Typography className="text-md font-medium text-blue-gray-900">
                                  {new Date(
                                    masterclass.startDate,
                                  ).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}
                                </Typography>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-blue-gray-900">
                                  Fin :
                                </span>
                                <Typography className="text-md font-medium text-blue-gray-900">
                                  {new Date(
                                    masterclass.endDate,
                                  ).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </Typography>
                              </div>
                            </div>
                          </div>
                          <div className="px-2">
                            <Countdown
                              targetDate={masterclass.startDate}
                              startDate={masterclass.startDate}
                              endDate={masterclass.endDate}
                            />
                          </div>
                        </div>
                        <Typography
                          variant="h5"
                          className="px-2 font-medium text-gray-900"
                        >
                          {masterclass.title}
                        </Typography>

                        <ReactQuill
                          value={
                            masterclass.description.length > 220
                              ? masterclass.description.substring(
                                  0,
                                  masterclass.description.lastIndexOf(" ", 220),
                                ) + "..."
                              : masterclass.description
                          }
                          readOnly={true}
                          theme="bubble"
                          className="text-gray-700"
                        />
                        <hr className="my-4" />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="relative ml-4">
                              {masterclass.instructor?.imageUrl ? (
                                <img
                                  src={`${BASE_URL}${masterclass.instructor?.imageUrl}`}
                                  alt={masterclass.instructor?.name}
                                  className="h-14 w-14 rounded-full object-cover"
                                />
                              ) : (
                                <div className="rounded-full bg-gray-400">
                                  <User className="h-14 w-14" />
                                </div>
                              )}

                              <Mic className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-red-400" />
                            </div>
                            <Typography variant="h6" className=" text-gray-900">
                              {masterclass.instructor?.name}
                            </Typography>
                          </div>
                          <Link to={`/masterclass/slug/${masterclass.slug}`}>
                            <Button
                              variant="gradient"
                              size="md"
                              className="mt-4"
                            >
                              Voir plus
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="mb-12 flex h-screen flex-col items-center justify-center">
          <Typography
            variant="h2"
            color="blue-gray"
            className="mb-6 text-center text-2xl font-extrabold"
          >
            Pas de sessions disponibles pour le moment.
          </Typography>
        </section>
      )}
    </div>
  );
};

export default MasterClass;
