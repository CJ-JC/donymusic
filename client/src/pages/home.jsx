import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function getTargetDate(daysFromNow) {
  const now = new Date();
  now.setDate(now.getDate() + daysFromNow);
  return now.toISOString();
}
export function Home() {
  const { courses, discountedCourses, globalDiscount, availableRemises } =
    useCourses();
  const targetDate = getTargetDate(10);
  const [masterclasses, setMasterclasses] = useState([]);
  const [error, setError] = useState(null);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            <Card className="rounded-lg shadow-lg shadow-gray-500/10">
              <CardBody className="px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-x-10 md:flex-row">
                  <div>
                    <Typography
                      variant="h5"
                      className="px-2 font-bold text-blue-gray-900"
                    >
                      {firstMasterclass.title}
                    </Typography>
                    <ReactQuill
                      value={
                        firstMasterclass.description.length > 200
                          ? firstMasterclass.description.substring(
                              0,
                              firstMasterclass.description.lastIndexOf(
                                " ",
                                200,
                              ),
                            ) + "..."
                          : firstMasterclass.description
                      }
                      readOnly={true}
                      theme="bubble"
                    />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-gray-500">
                      Début dans :
                    </Typography>
                    <Countdown
                      targetDate={firstMasterclass.startDate}
                      startDate={firstMasterclass.startDate}
                      endDate={firstMasterclass.endDate}
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
                  <Button variant="filled">Voir tous les cours</Button>
                </Link>
              </div>
            </div>
          </section>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white" />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Working with us is a pleasure
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Don't let your uses guess by attaching tooltips and popoves to
                any element. Just make sure you enable them first via
                JavaScript.
                <br />
                <br />
                The kit comes with three pre-built pages to help you get started
                faster. You can change the text and images and you're good to
                go. Just make sure you enable them first via JavaScript.
              </Typography>
              <Button variant="filled">read more</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="rounded-lg border shadow-lg shadow-gray-500/10">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src="/img/teamwork.png"
                    className="h-full w-full"
                  />
                </CardHeader>
                <CardBody>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    Enterprise
                  </Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Top Notch Services
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    The Arctic Ocean freezes every winter and much of the
                    sea-ice then thaws every summer, and that process will
                    continue whatever happens.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-48 pt-20">
        <div className="container mx-auto">
          <PageTitle section="Our Team" heading="Here are our heroes">
            According to the National Oceanic and Atmospheric Administration,
            Ted, Scambos, NSIDClead scentist, puts the potentially record
            maximum.
          </PageTitle>
          <div className="mt-24 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4">
            {teamData.map(({ img, name, position, socials }) => (
              <TeamCard
                key={name}
                img={img}
                name={name}
                position={position}
                socials={
                  <div className="flex items-center gap-2">
                    {socials.map(({ color, name }) => (
                      <IconButton key={name} color={color} variant="text">
                        <i className={`fa-brands text-xl fa-${name}`} />
                      </IconButton>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-white px-4 py-24">
        <div className="container mx-auto">
          <PageTitle section="Co-Working" heading="Build something">
            Put the potentially record low maximum sea ice extent tihs year down
            to low ice. According to the National Oceanic and Atmospheric
            Administration, Ted, Scambos.
          </PageTitle>
          <div className="mx-auto mb-48 mt-20 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
          <PageTitle section="Contact Us" heading="Want to work with us?">
            Complete this form and we will get back to you in 24 hours.
          </PageTitle>
          <form className="mx-auto mt-12 w-full lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Full Name" />
              <Input variant="outlined" size="lg" label="Email Address" />
            </div>
            <Textarea variant="outlined" size="lg" label="Message" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
