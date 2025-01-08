import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";

const Settings = () => {
  // État local pour les informations de l'utilisateur
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "",
    notificationsEnabled: true,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simuler une mise à jour des informations utilisateur
    setTimeout(() => {
      setLoading(false);
      alert("Les paramètres ont été mis à jour !");
    }, 1000);
  };

  return (
    <div className="mx-auto h-screen max-w-screen-xl py-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
          Paramètres de votre compte
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Entrez votre nom"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Entrez votre email"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="Entrez un nouveau mot de passe"
            />
          </div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mot de passe
          </label>

          <Input
            type="password"
            label="Mot de passe actuel"
            value={user.currentPassword}
            onChange={handleInputChange}
          />
          <Input
            type="password"
            label="Nouveau mot de passe"
            value={user.newPassword}
            onChange={handleInputChange}
          />
          <Input
            type="password"
            label="Confirmer le nouveau mot de passe"
            value={user.confirmPassword}
            onChange={handleInputChange}
          />
          {/* Bouton de soumission */}
          <div className="flex justify-center">
            <Button
              type="submit"
              color="blue"
              variant="filled"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Chargement..." : "Sauvegarder les modifications"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
