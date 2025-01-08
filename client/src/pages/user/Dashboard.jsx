// Composant Dashboard
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
const Dashboard = ({ user }) => {
  return (
    <Card className="p-6">
      <Typography variant="h4" className="mb-4">
        Informations Personnelles
      </Typography>
      <div className="space-y-4">
        <div>
          <Typography variant="h6">Nom</Typography>
          <Typography>{user?.lastName}</Typography>
        </div>
        <div>
          <Typography variant="h6">Prénom</Typography>
          <Typography>{user?.firstName}</Typography>
        </div>
        <div>
          <Typography variant="h6">Email</Typography>
          <Typography>{user?.email}</Typography>
        </div>
      </div>
    </Card>
  );
};
export default Dashboard;
