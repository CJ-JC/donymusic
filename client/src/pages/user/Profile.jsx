import React from "react";
import { Card, Typography } from "@material-tailwind/react";

// Composant Profile (Formations)
const Profile = ({ user }) => {
  return (
    <Card className="p-6">
      <Typography variant="h4" className="mb-4">
        Mes Formations
      </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {user?.courses?.map((course, index) => (
          <Card key={index} className="p-4">
            <Typography variant="h6">{course.title}</Typography>
            <Typography className="text-gray-600">
              {course.progress}% complété
            </Typography>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default Profile;
