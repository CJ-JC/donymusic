import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { PlusCircle, Trash2, TrashIcon } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const EditChapter = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const { id, courseId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    courseId: courseId,
  });

  // État pour gérer plusieurs vidéos
  const [videos, setVideos] = useState([{ title: "", url: "" }]);

  // Récupérer les données du chapitre et ses vidéos
  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await axios.get(`/api/chapter/${id}`);
        const { title, description, attachment } = response.data;

        setChapterData({
          title,
          description,
          attachment,
          courseId,
        });

        // Si des vidéos existent, les charger
        if (response.data.videos && response.data.videos.length > 0) {
          setVideos(
            response.data.videos.map((video) => ({
              id: video.id,
              title: video.title,
              url: video.url,
            })),
          );
        }
      } catch (error) {
        setError("Erreur lors de la récupération du chapitre");
      }
    };

    fetchChapterData();
  }, [id, courseId]);

  const handleChapterChange = (e) => {
    setChapterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoChange = (index, e) => {
    const newVideos = [...videos];
    newVideos[index][e.target.name] = e.target.value;
    setVideos(newVideos);
  };

  const handleAddVideo = () => {
    setVideos([...videos, { title: "", url: "" }]);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Valider que les vidéos ont des titres et des URLs
    const validVideos = videos.filter((video) => video.title && video.url);
    if (validVideos.length === 0) {
      setError("Au moins une vidéo avec un titre et une URL est requise");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Ajouter les données du chapitre
    formData.append("title", chapterData.title);
    formData.append("description", chapterData.description);
    formData.append("courseId", chapterData.courseId);
    formData.append("videos", JSON.stringify(validVideos));

    // Ajouter le fichier attaché
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await axios.put(`/api/chapter/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.chapter) {
        // Redirection vers la page du cours
        navigate(`/administrator/edit-course/${courseId}`);
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Une erreur est survenue lors de la mise à jour",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const deleteExistingAttachment = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/chapter/${id}/attachment`);
      if (response.data.chapter) {
        setChapterData((prev) => ({
          ...prev,
          attachment: null,
        }));
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Erreur lors de la suppression du fichier",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
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
        <h2 className="text-xl">Modification du chapitre</h2>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-md border p-4">
            <Input
              label="Titre du chapitre"
              type="text"
              id="title"
              name="title"
              value={chapterData.title}
              onChange={handleChapterChange}
              required
            />
          </div>
          <div className="space-y-2 rounded-md border p-4">
            <label
              htmlFor="description"
              className="text-sm font-medium text-blue-gray-900"
            >
              Description du chapitre
            </label>
            <Editor
              name="description"
              value={chapterData.description}
              onChange={handleChapterChange}
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-x-2">
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
                className="lucide lucide-video h-8 w-8 text-green-700"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
            </div>
            <h2 className="text-xl">Modification des vidéos</h2>
          </div>
          <button
            type="button"
            onClick={handleAddVideo}
            className="flex items-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter des vidéos
          </button>
        </div>

        {videos.map((video, index) => (
          <div
            key={index}
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="space-y-2 rounded-md border p-4">
              <Input
                label="Titre de la vidéo"
                required
                name="title"
                value={video.title}
                onChange={(e) => handleVideoChange(index, e)}
                type="text"
              />
            </div>
            <div className="relative space-y-2 rounded-md border p-4">
              <div className="flex items-center gap-2">
                <Input
                  label="URL de la vidéo"
                  required
                  name="url"
                  value={video.url}
                  onChange={(e) => handleVideoChange(index, e)}
                  type="text"
                />
                {videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="mt-10 flex items-center gap-x-2">
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
              className="lucide lucide-paperclip text-green-700"
            >
              <path d="M13.234 20.252 21 12.3" />
              <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
            </svg>
          </div>
          <h2 className="text-xl">Annexes de la formation</h2>
        </div>
        <div className="mt-6 w-full gap-6 space-y-2 rounded-md border p-4 md:w-2/4">
          <Input
            label="Fichier annexe"
            type="file"
            name="attachment"
            id="attachment"
            onChange={handleAttachmentChange}
          />

          {attachment && (
            <div className="mt-2">
              <div className="flex justify-between">
                {attachment.name.substring(0, 50)}{" "}
                <div className="flex gap-x-2">
                  <button onClick={removeAttachment} className="text-red-500">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {chapterData.attachment && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-gray-900">
                Fichier joint actuel
              </div>
              <Button
                variant="text"
                color="red"
                className="flex items-center gap-2"
                onClick={deleteExistingAttachment}
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4" />
                Supprimer le fichier
              </Button>
            </div>
            <div className="mt-4">
              <iframe
                src={`${BASE_URL}${chapterData.attachment}`}
                width="100%"
                height="500px"
                className="border"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button type="submit" className="mt-6 w-min" disabled={loading}>
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditChapter;
