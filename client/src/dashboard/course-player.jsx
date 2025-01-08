import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Progress, Typography } from "@material-tailwind/react";
import { Check, Lock, LogOut, PlayCircleIcon } from "lucide-react";
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

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { chapterId } = useParams();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(0);
  const [videoProgress, setVideoProgress] = useState({});
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
        axios
          .get(`/api/course/${courseId}`)
          .then((res) => {
            setCourse(res.data);
            if (res.data?.chapters?.[0]?.videos?.[0]) {
              setSelectedVideo(res.data.chapters[0].videos[0]);
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération du cours", error);
            setError("Impossible de charger le cours");
          })
          .finally(() => {
            setLoading(false);
          });
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
      const response = await axios.post(`/api/user-progress/create`, {
        userId: user.id,
        chapterId: chapter.id,
        progress: 100,
        isComplete: true,
        videoId: selectedVideo.id,
      });

      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideo.id]: response.data,
      }));

      const chapterProgressResponse = await axios.get(
        `/api/user-progress/${chapter.id}`,
      );
      const { progress, isComplete } = chapterProgressResponse.data;

      setProgress(progress);

      if (isComplete) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression :", error);
    }
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (chapterId) {
        try {
          const response = await axios.get(`/api/user-progress/${chapterId}`);
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
  }, [chapterId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!course) {
    return <Loading />;
  }

  let isLocked = false;

  return (
    <>
      <Confetti isActive={showConfetti} />
      <aside
        id="cta-button-sidebar"
        className={`fixed inset-y-0 z-50 h-full w-80 flex-col border-r bg-white shadow-sm transition-transform duration-300
		${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
		md:block md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm">
          <div className="flex h-20 w-full flex-col space-y-2 border-b p-4">
            <Typography variant="h5" className="font-semibold">
              {course?.title}
            </Typography>
            <div className="w-full">
              <Progress value={progress} size="sm" color="green" />
            </div>
            <CloseIcon
              className={`absolute right-4 top-6 h-6 w-6 rounded-sm text-gray-500 opacity-70 transition-colors hover:text-gray-700 md:opacity-0 ${
                isSidebarOpen ? "cursor-pointer" : "disabled"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <ul className="w-full p-2 font-medium">
            {course.chapters.map((chapter) => (
              <Accordion
                key={chapter.id}
                open={open === chapter.id}
                icon={<Icon id={chapter.id} open={open} />}
              >
                <AccordionHeader
                  onClick={() => handleOpen(chapter.id)}
                  className="p-3 text-lg font-bold"
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
                                if (!isLocked) {
                                  setSelectedVideo(video);
                                }
                              }}
                              disabled={isLocked}
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
        </div>
      </aside>

      <div className="h-full md:pl-80">
        <div className="sticky inset-x-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b bg-white p-4">
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
          <div className="flex items-center pr-4">
            <Link to={"/detail/slug/" + course.slug}>
              <button className="flex items-center text-gray-900 hover:text-gray-700 focus:text-gray-700 focus:outline-none">
                <LogOut className="mr-1 h-4 w-4" /> Retour
              </button>
            </Link>
          </div>
        </div>
        <div className="mx-auto flex flex-col pb-20 xl:max-w-7xl">
          <div className="m-2">
            <div className="border-yellow-30 text-primary flex w-full items-center border bg-yellow-200/80 p-4 text-sm">
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
                className="lucide lucide-triangle-alert mr-2 h-4 w-4"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
              Vous devez acheter cette formation pour regarder ce chapitre.
            </div>
            <div className="relative aspect-video">
              {/* {!isReady && !isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-[#1E293B] text-white">
                  <Lock className="h-8 w-8" />
                  <p className="text-sm">Ce chapitre est verouillé</p>
                </div>
              )}
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

            <div className="flex flex-col items-center justify-between py-4 md:flex-row">
              <Typography variant="h4" className="font-bold" color="blue-gray">
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
                disabled={videoProgress[selectedVideo?.id]?.isComplete}
              >
                {videoProgress[selectedVideo?.id]?.isComplete
                  ? "Complété"
                  : "Terminer la vidéo"}
              </Button>
            </div>
            <hr />

            <Typography variant="h6" className="mt-4 font-medium">
              <ReactQuill
                value={course.description}
                readOnly={true}
                theme="bubble"
              />
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePlayer;
