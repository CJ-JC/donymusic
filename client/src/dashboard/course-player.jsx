import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Progress, Typography } from "@material-tailwind/react";
import { Check, LogOut, MoonIcon, PlayCircleIcon, SunIcon } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Loading from "@/widgets/utils/Loading";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import Confetti from "@/widgets/utils/Confetti";
import { loggedOut } from "@/reducer/auth";
import { ArrowBack } from "@mui/icons-material";
import CreateRemark from "./Create-remark";
import CreateNote from "./Create-note";

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

const CoursePlayer = ({ toggleTheme, theme }) => {
  const { courseId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(0);
  const [videoProgress, setVideoProgress] = useState({});
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("presentation");

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  useEffect(() => {
    if (
      !authLoading &&
      (!isLoggedIn || !user || (user.role !== "admin" && user.role !== "user"))
    ) {
      return navigate("/sign-in");
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (courseId) {
        setLoading(true);

        try {
          const res = await axios.get(`/api/course/${courseId}`);
          setCourse(res.data);

          // Prioriser le dernier chapitre et vidéo vus
          if (res.data.lastViewedVideoId) {
            const lastViewedVideo = res.data.chapters
              .flatMap((chapter) => chapter.videos)
              .find((video) => video.id === res.data.lastViewedVideoId);

            if (lastViewedVideo) {
              setSelectedVideo(lastViewedVideo);
              return;
            }
          }

          // Trouver la première vidéo non visionnée
          const unwatchedVideo = res.data.chapters
            .flatMap((chapter) => chapter.videos)
            .find((video) => !videoProgress[video.id]?.isComplete);

          if (unwatchedVideo) {
            setSelectedVideo(unwatchedVideo);
          } else if (res.data?.chapters?.[0]?.videos?.[0]) {
            setSelectedVideo(res.data.chapters[0].videos[0]);
          }
        } catch (error) {
          setError("Impossible de charger le cours");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [authLoading, isLoggedIn, user, courseId]);

  useEffect(() => {
    const fetchAllVideosProgress = async () => {
      if (!user || !user.id || !course) return;

      try {
        for (const chapter of course.chapters) {
          for (const video of chapter.videos) {
            const response = await axios.get(
              `/api/user-progress/video/${video.id}`,
            );
            setVideoProgress((prev) => ({
              ...prev,
              [video.id]: response.data,
            }));
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des progressions:",
          error,
        );
      }
    };

    fetchAllVideosProgress();
  }, [course, user]);

  const handleVideoEnd = async () => {
    if (!course || !selectedVideo || !user || !user.id) {
      return;
    }

    const chapter = course.chapters.find((chapter) =>
      chapter.videos.some((video) => video.id === selectedVideo.id),
    );

    if (!chapter) {
      return;
    }

    try {
      // Vérifier l'état actuel de la progression
      const currentProgress = videoProgress[selectedVideo.id]?.isComplete;

      // Inverser l'état de complétion
      const newIsComplete = !currentProgress;

      const response = await axios.post(`/api/user-progress/create`, {
        userId: user.id,
        chapterId: chapter.id,
        progress: newIsComplete ? 100 : 0,
        isComplete: newIsComplete,
        videoId: selectedVideo.id,
      });

      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideo.id]: response.data,
      }));

      // const chapterProgressResponse = await axios.get(
      //   `/api/user-progress/${chapter.id}`,
      // );
      // const { progress, isComplete } = chapterProgressResponse.data;

      // setProgress(progress);

      // if (isComplete) {
      //   setShowConfetti(true);
      //   setTimeout(() => {
      //     setShowConfetti(false);
      //   }, 5000);
      // }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression :", error);
    }
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (courseId) {
        try {
          const response = await axios.get(`/api/user-progress/${courseId}`);
          const { progress } = response.data;
          setProgress(progress);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de la progression :",
            error,
          );
          setProgress(0);
        }
      }
    };

    fetchUserProgress();
  }, [courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        await axios.get(`/api/course/${courseId}`);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/");
        } else {
          navigate("/");
        }
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const logout = () => {
    axios.post("/api/user/logout");
    dispatch(loggedOut());
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!course) {
    return <Loading />;
  }
  // https://vimeo.com/1042814950
  // https://vimeo.com/878479641
  // https://vimeo.com/1042812947
  // https://vimeo.com/855651404

  const tabs = [
    { id: "presentation", label: "Présentation" },
    { id: "qa", label: "Question - Réponse" },
    { id: "notes", label: "Prise de note" },
  ];

  return (
    <>
      <Confetti isActive={showConfetti} />
      <aside
        id="cta-button-sidebar"
        className={`fixed inset-y-0 z-50 h-full w-80 flex-col border-r bg-white shadow-sm transition-transform duration-300 dark:bg-[#020818]
		${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
		md:block md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm dark:bg-[#020818]">
          <div className="flex h-20 w-full flex-col space-y-2 border-b p-4">
            <Typography variant="h5" className="font-semibold">
              {course?.title}
            </Typography>
            <div className="w-full">
              <Progress value={progress} size="sm" color="green" />
            </div>
            <CloseIcon
              className={`absolute right-4 top-3 h-6 w-6 rounded-sm text-gray-500 opacity-70 transition-colors hover:text-gray-700 md:opacity-0 ${
                isSidebarOpen ? "cursor-pointer" : "disabled"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <ul className="h-screen w-full overflow-auto p-2 font-medium">
            {course.chapters.map((chapter) => (
              <Accordion
                key={chapter.id}
                open={open === chapter.id}
                icon={<Icon id={chapter.id} open={open} />}
              >
                <AccordionHeader
                  onClick={() => handleOpen(chapter.id)}
                  className="p-3 text-lg font-bold dark:text-white"
                >
                  {chapter.title}
                </AccordionHeader>
                <AccordionBody className="p-0">
                  {chapter.videos && chapter.videos.length > 0 && (
                    <ul>
                      {chapter.videos.map((video) => {
                        const isCompleted = videoProgress[video.id]?.isComplete;
                        return (
                          <li key={video.id}>
                            <button
                              onClick={() => {
                                setSelectedVideo(video);
                              }}
                              className={`my-1 flex w-full items-center gap-x-2 p-3 text-sm font-bold transition
                                ${
                                  isCompleted
                                    ? "bg-green-400 text-white hover:bg-green-600"
                                    : selectedVideo?.id === video.id
                                    ? "bg-gray-200 text-blue-gray-900"
                                    : "text-blue-gray-800 hover:bg-gray-200"
                                }
                              `}
                            >
                              <span
                                className={`gap-x-1 ${
                                  isCompleted
                                    ? "text-white"
                                    : "text-blue-gray-800"
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="h-5 w-5" />
                                ) : (
                                  <PlayCircleIcon className="h-5 w-5" />
                                )}
                              </span>
                              {video.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </AccordionBody>
              </Accordion>
            ))}
          </ul>
          <hr />
          <ul className="my-5 flex justify-center">
            <Button
              onClick={logout}
              variant="outlined"
              size="sm"
              className="flex items-center bg-white focus:outline-none"
            >
              <LogOut className="mr-1 h-4 w-4" /> Déconnexion
            </Button>
          </ul>
        </div>
      </aside>

      <div className="h-full md:pl-80">
        <div className="sticky inset-x-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b bg-white p-4 dark:bg-[#020818]">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={"/detail/slug/" + course.slug}>
              <Button
                size="sm"
                variant="outlined"
                className="flex items-center dark:bg-white dark:text-black"
              >
                <ArrowBack /> Retour
              </Button>
            </Link>

            <button
              onClick={toggleTheme}
              className="theme-toggle rounded-md hover:bg-gray-200"
            >
              {theme === "dark" ? (
                <SunIcon className="text- h-8 w-8 p-1 text-white dark:hover:text-black" />
              ) : (
                <MoonIcon className="h-8 w-8 p-1" />
              )}
            </button>
          </div>
        </div>
        <div className="mx-auto flex flex-col pb-20 xl:max-w-5xl">
          <div className="m-2">
            <div className="relative aspect-video">
              {selectedVideo && (
                <ReactPlayer
                  url={selectedVideo.url}
                  className="react-player"
                  width="100%"
                  height="100%"
                  controls={true}
                  onEnded={handleVideoEnd}
                  config={{
                    vimeo: {
                      playerOptions: {
                        dnt: true,
                        title: true,
                        responsive: true,
                      },
                    },
                  }}
                />
              )}
            </div>
            <div className="mx-auto my-4">
              <div className="flex justify-center border-b border-gray-200 py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 py-1 text-sm font-medium focus:outline-none ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-gray-900 font-semibold text-blue-gray-900 dark:border-white dark:text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Tabs Content */}
              <div className="mt-4">
                {activeTab === "presentation" && (
                  <div className="h-[600px]">
                    <div className="flex  items-center justify-between md:flex-row">
                      <Typography
                        variant="h4"
                        className="blue-gray-900 px-2 font-bold dark:text-white"
                      >
                        {selectedVideo?.title}
                      </Typography>
                      <Button
                        variant="gradient"
                        color={
                          videoProgress[selectedVideo?.id]?.isComplete
                            ? "blue-gray"
                            : "green"
                        }
                        size="sm"
                        onClick={handleVideoEnd}
                      >
                        {videoProgress[selectedVideo?.id]?.isComplete
                          ? "Complété"
                          : "Terminer la vidéo"}
                      </Button>
                    </div>

                    <div className="font-medium text-gray-700 dark:text-white">
                      <ReactQuill
                        value={course.description}
                        readOnly={true}
                        theme="bubble"
                      />
                    </div>
                  </div>
                )}
                {activeTab === "qa" && (
                  <CreateRemark selectedVideo={selectedVideo} />
                )}
                {activeTab === "notes" && (
                  <CreateNote selectedVideo={selectedVideo} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePlayer;
