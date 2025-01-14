import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { PageTitle } from "@/widgets/layout";
import { TeamCard } from "@/widgets/cards";
import { teamData, contactData } from "@/data";
import CourseList from "@/components/Course-list";
import useCourses from "@/widgets/utils/UseCourses";
import Countdown from "@/widgets/utils/Countdown";
import Loading from "@/widgets/utils/Loading";
import axios from "axios";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";
import { Monitor, Rocket, UsersRound } from "lucide-react";
import Contact from "@/components/Contact";

export function Home() {
  const { courses, discountedCourses, globalDiscount, availableRemises } =
    useCourses();

  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const firstMasterclass = masterclasses[0];

  return (
    <>
      <div className="relative flex h-[700px] content-center items-center justify-center pb-32 pt-16">
        <video
          className="absolute top-0 h-full w-full object-cover "
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/img/dony-music.mov" type="video/mp4" />
        </video>
        <div className="absolute top-0 h-full w-full bg-black/80 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
                Laissez la musique vous inspirer.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                Avec DonyMusic, découvrez une nouvelle façon d'apprendre à jouer
                de vos instruments préférés. Suivez des cours interactifs,
                progressez à votre rythme et réalisez vos rêves musicaux.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto -mt-28 max-w-screen-xl bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          {firstMasterclass && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
              <Card className="rounded-lg shadow-lg shadow-gray-500/10">
                <CardBody className="px-4 py-6">
                  <div className="flex flex-col items-center justify-between gap-x-10 md:flex-row">
                    <div>
                      <Typography
                        variant="h5"
                        className="px-2 font-bold text-blue-gray-900"
                      >
                        {firstMasterclass?.title}
                      </Typography>
                      <div className="text-sm text-blue-gray-500">
                        <ReactQuill
                          value={
                            firstMasterclass?.description.length > 200
                              ? firstMasterclass?.description.substring(
                                  0,
                                  firstMasterclass?.description.lastIndexOf(
                                    " ",
                                    200,
                                  ),
                                ) + "..."
                              : firstMasterclass?.description
                          }
                          readOnly={true}
                          theme="bubble"
                        />
                      </div>
                    </div>
                    <div>
                      <Typography variant="h6" className="text-blue-gray-500">
                        Début dans :
                      </Typography>
                      <Countdown
                        targetDate={firstMasterclass?.startDate}
                        startDate={firstMasterclass?.startDate}
                        endDate={firstMasterclass?.endDate}
                      />
                    </div>
                  </div>
                  <div className="flex w-full justify-center">
                    <Link to="/masterclass">
                      <Button variant="gradient" size="md" className="mt-4">
                        En savoir plus
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
          <section className="mt-32 flex flex-wrap items-center">
            <div className="container mx-auto">
              <PageTitle
                section="Explorez Nos Cours"
                heading="Maîtrisez Votre Instrument"
              >
                Découvrez nos formations et perfectionnez vos compétences
                musicales
              </PageTitle>

              <CourseList
                courses={discountedCourses}
                globalDiscount={globalDiscount}
                availableRemises={availableRemises}
              />

              <div className="my-24 flex justify-center">
                <Link to={`/courses`} className="rounded-full">
                  <Button variant="gradient">Voir tous les cours</Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* About */}
      <section className="mx-auto -mt-28 max-w-screen-xl px-4 py-20">
        {/* <PageTitle section="" heading=""></PageTitle>
        <div className="relative mt-16 overflow-hidden">
          <div className="mx-auto">
            <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
              <svg
                className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100"></polygon>
              </svg>
              <div className="pt-1"></div>

              <div className="mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-blue-gray-500 sm:text-center lg:text-left">
                  <p>
                    Donec porttitor, enim ut dapibus lobortis, lectus sem
                    tincidunt dui, eget ornare lectus ex non libero. Nam rhoncus
                    diam ultrices porttitor laoreet. Ut mollis fermentum ex, vel
                    viverra lorem volutpat sodales. In ornare porttitor odio sit
                    amet laoreet. Sed laoreet, nulla a posuere ultrices, purus
                    nulla tristique turpis, hendrerit rutrum augue quam ut est.
                    Fusce malesuada posuere libero, vitae dapibus eros facilisis
                    euismod. Sed sed lobortis justo, ut tincidunt velit. Mauris
                    in maximus eros.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover object-top sm:h-72 md:h-96 lg:h-full lg:w-full"
              src="https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_960_720.jpg"
              alt=""
            />
          </div>
        </div> */}
        <div className="container mx-auto">
          <PageTitle
            section="À propos de nous"
            heading="Découvrez notre engagement"
          >
            Découvrez votre formateur
          </PageTitle>

          <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
            {/* Texte avec animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-blue-gray-900">
                Une approche moderne de l'éducation
              </h2>
              <p className="leading-relaxed text-blue-gray-500">
                Nous croyons en l'innovation pour rendre l'apprentissage
                accessible et impactant. Nos cours sont conçus pour répondre aux
                besoins actuels, tout en anticipant les défis de demain.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-blue-gray-500">
                <li>Apprentissage personnalisé et interactif.</li>
                <li>Contenus actualisés par des experts renommés.</li>
                <li>Certifications reconnues pour booster votre carrière.</li>
              </ul>
            </motion.div>

            {/* Image avec effet de zoom */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src="https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_960_720.jpg"
                alt="Équipe en action"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>

          {/* Section chiffres clés avec animation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <Typography
              className="text-xl font-bold text-blue-gray-900"
              variant="h4"
            >
              Ce que propose Donymusic
            </Typography>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-blue-gray-500">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-blue-gray-500">
                    <strong>Formation en ligne</strong>: Accédez à des cours
                    interactifs et flexibles, disponibles 24/7 pour s'adapter à
                    votre emploi du temps.
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-blue-gray-500">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <UsersRound className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-blue-gray-500">
                    <strong>Communauté dynamique</strong>: Rejoignez une
                    communauté d'apprenants et partagez vos expériences.
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-blue-gray-500">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-blue-gray-500">
                    <strong>Atteignez de nouveaux sommets</strong>: Progresser
                    n’a jamais été aussi simple. Développez vos compétences et
                    avancez vers vos rêves.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <div className="mt-12 flex justify-center">
            <Button
              variant="gradient"
              size="md"
              onClick={() => navigate("/sign-up")}
              className="px-6 py-3 text-white"
            >
              Rejoignez-nous aujourd'hui
            </Button>
          </div>
        </div>
      </section>
      {/* bg-[#F9FAFB] */}

      <section className="mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Contact />
        </motion.div>
      </section>
    </>
  );
}

export default Home;
