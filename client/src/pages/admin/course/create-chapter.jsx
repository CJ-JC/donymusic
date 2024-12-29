import React, { useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const CreateChapter = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    courseId: courseId,
  });

  // État pour gérer plusieurs vidéos
  const [videos, setVideos] = useState([{ title: "", url: "" }]);

  const handleChapterChange = (e) => {
    setChapterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Gestion des changements pour chaque vidéo
  const handleVideoChange = (index, e) => {
    const newVideos = [...videos];
    newVideos[index][e.target.name] = e.target.value;
    setVideos(newVideos);
  };

  // Ajouter un nouveau champ vidéo
  const handleAddVideo = () => {
    setVideos([...videos, { title: "", url: "" }]);
  };

  // Supprimer un champ vidéo
  const handleRemoveVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/chapter/create", {
        ...chapterData,
        videos: videos,
      });

      navigate(`/administrator/edit-course/${courseId}`);
    } catch (error) {
      setError(error.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-6">
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
        <h2 className="text-xl">Mise en place du chapitre</h2>
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
              type="text"
              id="title"
              name="title"
              value={chapterData.title}
              onChange={handleChapterChange}
              label="Titre du chapitre"
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
            {/* <Textarea
              id="description"
              name="description"
              value={chapterData.description}
              onChange={handleChapterChange}
              placeholder="La description du chapitre"
              required
              resize
            /> */}
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
            <h2 className="text-xl">Mise en place des vidéos</h2>
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
                  label="Vidéo aperçu de la formation"
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

        <div className="flex justify-center">
          <Button type="submit" className="mt-6" disabled={loading}>
            {loading ? "Création..." : "Créer le chapitre"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateChapter;
