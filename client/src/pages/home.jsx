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
import { PageTitle } from "@/widgets/layout";
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
  const { discountedCourses, globalDiscount, availableRemises } = useCourses();

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

      <section className="mx-auto -mt-24 max-w-screen-xl px-4 pb-20">
        <div className="container mx-auto">
          {firstMasterclass && (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              <Card className="rounded-lg shadow-lg shadow-gray-500/10 dark:bg-white/90">
                <CardBody className="px-4 py-6">
                  <div className="flex flex-col items-center justify-between gap-x-10 md:flex-row">
                    <div>
                      <Typography
                        variant="h5"
                        className="px-2 font-bold text-blue-gray-900"
                      >
                        {firstMasterclass?.title}
                      </Typography>
                      <div className="text-sm text-blue-gray-500 dark:text-black">
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
                      <Typography
                        variant="h6"
                        className="text-blue-gray-500 dark:text-black"
                      >
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
                      <Button size="md" className="mt-4">
                        En savoir plus
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
          <section className="mt-32 flex flex-wrap items-center">
            <div className="container mx-auto dark:text-white">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
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
                    <Button className="dark:bg-white dark:text-black dark:hover:bg-gray-400">
                      Voir tous les cours
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </section>
      {/* About */}
      <section className="mx-auto -mt-28 max-w-screen-xl px-4 py-20">
        <div className="container mx-auto">
          <PageTitle
            section="À propos du formateur"
            heading="Découvrez votre formateur"
          >
            Apprenez à connaître votre formateur
          </PageTitle>

          <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
            {/* Section du formateur avec animation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mt-4 flex items-center space-x-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-gray-900 dark:text-white">
                    Jean Dupont
                  </h3>
                  <p className="text-blue-gray-500 dark:text-white">
                    Pianiste expert, passionné par la musique et la transmission
                    de son art. Avec plus de 10 ans d'expérience, il a donné des
                    concerts à travers le monde et formé de nombreux élèves, les
                    accompagnant dans leur parcours musical avec patience et
                    expertise.
                  </p>

                  <div className="mt-4 flex space-x-4">
                    <a
                      href="https://www.linkedin.com/in/jeandupont"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.i
                        whileHover={{ scale: 1.2 }}
                        className="fab fa-facebook text-xl text-blue-600"
                      ></motion.i>
                    </a>
                    <a
                      href="https://www.youtube.com/@donymusic0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.i
                        whileHover={{ scale: 1.2 }}
                        className="fab fa-youtube text-xl text-red-500"
                      ></motion.i>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image avec effet de zoom */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/img/formateur.png"
                alt="Formateur en action"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-28 max-w-screen-xl px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <PageTitle
              section="Nos Services"
              heading="Ce que propose Donymusic"
            >
              Découvrez une plateforme de formation pour développer vos
              compétences musicales et professionnelles.
            </PageTitle>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center justify-center text-blue-gray-500">
                  <div className="rounded-full bg-blue-gray-900 p-2 text-white">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <p className="mt-2 text-blue-gray-500 dark:text-white">
                    <strong>Formation en ligne</strong> : Accédez à des cours
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
                  <p className="mt-2 text-blue-gray-500 dark:text-white">
                    <strong>Communauté dynamique</strong> : Rejoignez une
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
                  <p className="mt-2 text-blue-gray-500 dark:text-white">
                    <strong>Atteignez de nouveaux sommets</strong> : Progresser
                    n’a jamais été aussi simple. Développez vos compétences et
                    avancez vers vos rêves.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <div className="mt-24 flex justify-center">
            <Button
              size="md"
              onClick={() => navigate("/sign-up")}
              className="px-6 py-3 dark:bg-white dark:text-black dark:hover:bg-gray-400"
            >
              Rejoignez-nous aujourd'hui
            </Button>
          </div>
        </div>
      </section>
      {/* bg-[#F9FAFB] */}

      <section className="mx-auto px-4 py-20">
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
