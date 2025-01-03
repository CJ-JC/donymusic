import React, { useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import AlertError from "@/widgets/utils/AlertError";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Editor from "@/widgets/utils/Editor";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleVideoChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const [inputs, setInputs] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("title", inputs.title);
    formdata.append("slug", inputs.slug);
    formdata.append("description", inputs.description);
    formdata.append("price", inputs.price);
    formdata.append("videoUrl", inputs.videoUrl);

    try {
      setLoading(true);
      const response = await axios.post("/api/course/create", formdata);
      const newCourseId = response.data.result.id;

      navigate(`/administrator/edit-course/${newCourseId}`);

      setInputs({
        title: "",
        slug: "",
        description: "",
        price: "",
        videoUrl: "",
      });
      setFile(null);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="px-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Mise en place de la formation
        </h2>
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
                  type="text"
                  id="title"
                  name="title"
                  label="Titre de la formation"
                  required
                  value={inputs.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-blue-gray-900"
                >
                  Description de la formation
                </label>
                <Editor
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                />{" "}
              </div>
              <div className="mt-6 space-y-2 rounded-md border p-4">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-blue-gray-900"
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
                  <label className="flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 tracking-wide shadow-sm hover:text-gray-700">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">
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
                <div className="mt-6 space-y-2 rounded-md border p-4">
                  <div className="flex items-center justify-between font-medium">
                    <label
                      htmlFor="chapterTitle"
                      className="text-sm font-medium text-blue-gray-900"
                    >
                      Chapitre de la formation
                    </label>
                    <button
                      size="sm"
                      className="flex cursor-not-allowed items-center rounded-md p-2 text-gray-400"
                      disabled
                      title="Créez d'abord le cours pour ajouter des chapitres"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter chapitre
                    </button>
                  </div>
                  <p className="text-sm italic text-gray-600">
                    Créez d'abord le cours pour ajouter des chapitres
                  </p>
                </div>
                <div className="mt-6 space-y-2 rounded-md border p-4">
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
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-blue-gray-900"
                >
                  Prix de la formation
                </label>
                <Input
                  placeholder="Exemple: Ajouter le lien de la vidéo"
                  required
                  name="price"
                  id="price"
                  type="number"
                  value={inputs.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="mt-6" disabled={loading}>
              {loading ? "Création..." : "Créer le cours"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
