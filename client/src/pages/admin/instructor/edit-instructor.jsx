import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Textarea,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditInstructor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await axios.get(`/api/instructor/${id}`);
        const instructor = response.data;
        setFormData({
          name: instructor.name,
          biography: instructor.biography,
          image: null,
        });
        setCurrentImage(instructor.imageUrl);
      } catch (err) {
        setError("Erreur lors de la récupération des données de l'instructeur");
      }
    };

    fetchInstructor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("biography", formData.biography);
      if (formData.image) {
        formDataToSend.append("images", formData.image);
      }
      formDataToSend.append("imageUrl", currentImage);

      await axios.put(`/api/instructor/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/administrator/instructors");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la modification",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-3xl p-6">
        <Typography variant="h4" color="blue-gray" className="mb-6">
          Modifier l'instructeur
        </Typography>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Nom
            </Typography>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Nom de l'instructeur"
            />
          </div>

          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Biographie
            </Typography>
            <Textarea
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              required
              placeholder="Biographie de l'instructeur"
              rows={6}
            />
          </div>

          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Photo
            </Typography>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {preview ? (
              <img
                src={preview}
                alt="Aperçu"
                className="mt-2 max-w-xs rounded-lg shadow-lg"
              />
            ) : (
              currentImage && (
                <img
                  src={`${BASE_URL}${currentImage}`}
                  alt="Image actuelle"
                  className="mt-2 max-w-xs rounded-lg shadow-lg"
                />
              )
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outlined"
              onClick={() => navigate("/administrator/instructors")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} variant="gradient">
              {loading ? "Modification en cours..." : "Modifier l'instructeur"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
