import React, { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertError from "@/widgets/utils/AlertError";
import { Pen, PlusCircle, TrashIcon } from "lucide-react";
import Vimeo from "@u-wave/react-vimeo";
import Modal from "@/widgets/utils/Modal";
import axios from "axios";
import PublishButton from "@/widgets/utils/PublishButton";
import Editor from "@/widgets/utils/Editor";

const editCourse = () => {
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/course/${id}`);
        const {
          title,
          description,
          price,
          videoUrl,
          imageUrl,
          slug,
          chapters,
          isPublished,
        } = response.data;

        setInputs({
          title,
          description,
          price,
          videoUrl,
          slug,
          chapters,
          isPublished,
        });

        setImageUrl(imageUrl ? `${"http://localhost:8001"}${imageUrl}` : null);
        setVideoUrl(videoUrl ? `${videoUrl}` : null);
      } catch (error) {
        setError("Erreur lors de la récupération du cours :", error);
      }
    };

    fetchCourse();
  }, [id]);

  const [inputs, setInputs] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    videoUrl: "",
    chapters: [],
    isPublished: false,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (
      !inputs.title ||
      !inputs.slug ||
      !inputs.description ||
      !inputs.price ||
      !inputs.videoUrl
    ) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    // Validation du prix
    if (isNaN(parseFloat(inputs.price)) || parseFloat(inputs.price) <= 0) {
      setError("Le prix doit être un nombre valide et supérieur à 0");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("title", inputs.title);
    formData.append("slug", inputs.slug);
    formData.append("description", inputs.description);
    formData.append("price", inputs.price);
    formData.append("videoUrl", inputs.videoUrl);

    try {
      setLoading(true);
      await axios.put(`/api/course/update/${id}`, formData);
      setLoading(false);
      navigate("/administrator");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
      setLoading(false);
    }
  };

  const openModal = (chapterId) => {
    setChapterToDelete(chapterId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setChapterToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (chapterToDelete) {
      try {
        await axios.delete(`/api/chapter/delete/${chapterToDelete}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting chapter:", error);
      } finally {
        closeModal();
      }
    }
  };

  const handleDelete = async (chapterDelete) => {
    try {
      await axios.delete(`/api/course/delete/${chapterDelete}`);
      navigate(`/administrator`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    } finally {
      closeModal();
    }
  };

  const handleStatusChange = (courseId, newStatus) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, isPublished: newStatus } : course,
      ),
    );
  };

  return (
    <>
      {inputs.isPublished === false && (
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
          Cette formation n'est pas publiée. Elle ne sera pas visible pour les
          élèves.
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h1 className="text-xl font-medium md:text-2xl">
            Mise en place de la formation
          </h1>
          <div className="flex items-center gap-x-2">
            <PublishButton
              inputs={inputs}
              courseId={id}
              isPublished={inputs.isPublished}
              onStatusChange={(newStatus) =>
                handleStatusChange(courses.id, newStatus)
              }
            />
            <button
              className="rounded-lg bg-red-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-800"
              title="Supprimer la formation"
              type="button"
              onClick={() => handleDelete(id)}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AlertError error={error} />
        <form onSubmit={handleSubmit}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
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
                    className="lucide lucide-layout-dashboard h-8 w-8 text-green-700"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                  </svg>
                </div>
                <h2 className="text-xl">Personnalisez votre formation</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  label="Titre de la formation"
                  required
                  name="title"
                  id="formation"
                  type="text"
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="-mb-3 text-sm font-medium text-blue-gray-900"
                >
                  Description de la formation
                </label>
                <Editor
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                />
              </div>
              <div className="my-6 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="-mb-3 text-sm font-medium text-blue-gray-900"
                >
                  Image de la formation
                </label>
                <div className="bg-grey-lighter flex w-full items-center justify-between">
                  {imageUrl && (
                    <div className="mb-4">
                      <img
                        src={
                          imageUrl.startsWith("blob:")
                            ? imageUrl
                            : `${imageUrl}`
                        }
                        alt="Aperçu du cours"
                        className="mt-2 h-32 w-32 rounded object-cover"
                      />
                    </div>
                  )}
                  <label className="flex w-64 cursor-pointer flex-col items-center justify-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm hover:text-gray-700">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-center text-base leading-normal">
                      Sélectionner un fichier
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
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
                      className="lucide lucide-list-checks h-8 w-8 text-green-700"
                    >
                      <path d="m3 17 2 2 4-4"></path>
                      <path d="m3 7 2 2 4-4"></path>
                      <path d="M13 6h8"></path>
                      <path d="M13 12h8"></path>
                      <path d="M13 18h8"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl">Chapitres de la formation</h2>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4 ">
                  <div className="flex items-center justify-between font-medium">
                    <label
                      htmlFor="chapterTitle"
                      className="-mb-3 text-sm font-medium text-blue-gray-900"
                    >
                      Titre du chapitre
                    </label>

                    <Link to={`/administrator/create-chapter/${id}`}>
                      <button
                        size="sm"
                        className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter chapitre
                      </button>
                    </Link>
                  </div>
                  {inputs.chapters.length === 0 && (
                    <p className="text-sm italic text-gray-600">
                      Pas de chapitres
                    </p>
                  )}
                  {inputs.chapters.length > 0 &&
                    inputs.chapters
                      .slice()
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                      )
                      .map((chapter) => (
                        <div
                          key={chapter.id}
                          className="mt-6 space-y-2 rounded-md border p-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm italic text-gray-800">
                              {chapter.title}
                            </p>
                            <div className="flex items-center gap-x-2">
                              <Link
                                to={`/administrator/course/${id}/edit-chapter/${chapter.id}`}
                              >
                                <button
                                  size="sm"
                                  className="flex items-center rounded-md p-2 text-sm hover:bg-gray-100 focus:outline-none"
                                >
                                  <Pen className="mr-1 h-4 w-4" />
                                  Modifier
                                </button>
                              </Link>
                              <button
                                onClick={() => openModal(chapter.id)}
                                className="flex items-center rounded-md bg-red-600 p-2 text-sm text-white hover:bg-red-500 focus:outline-none"
                                type="button"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  {videoUrl && (
                    <div className="mb-4">
                      <Vimeo
                        video={videoUrl}
                        responsive={true}
                        autoplay={false}
                      />
                    </div>
                  )}
                  <Input
                    label="Vidéo aperçu de la formation"
                    required
                    name="videoUrl"
                    id="videoUrl"
                    type="text"
                    value={inputs.videoUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2">
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
                    className="lucide lucide-circle-dollar-sign h-8 w-8 text-green-700"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                    <path d="M12 18V6"></path>
                  </svg>
                </div>
                <h2 className="text-xl">Vendre votre formation</h2>
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <Input
                  label="Prix de la formation"
                  required
                  name="price"
                  id="price"
                  type="number"
                  value={inputs.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Modal
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              handleConfirmDelete={handleConfirmDelete}
            />
          </div>
          <div className="flex justify-center">
            <Button className="mt-6 w-min" onClick={handleSubmit}>
              Modifier
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default editCourse;
