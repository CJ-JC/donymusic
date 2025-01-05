import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import Countdown from "../widgets/utils/Countdown";
import {
  Calendar,
  Clock,
  Users,
  Euro,
  Hourglass,
  CalendarClock,
} from "lucide-react";
import ReactQuill from "react-quill";
import FormatHour from "@/widgets/utils/FormatHour";
import Loading from "@/widgets/utils/Loading";
import { CalculateDuration } from "@/widgets/utils/calculateDuration";
import parse from "html-react-parser";

const MasterclassDetail = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { slug } = useParams();
  const [masterclass, setMasterclass] = useState(null);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMasterclassDetails = async () => {
      try {
        const response = await fetch(`/api/masterclass/slug/${slug}`);
        if (!response.ok) {
          navigate("/");
          return;
        }
        const data = await response.json();
        setMasterclass(data);
      } catch (error) {
        setError(
          "Erreur lors de la récupération des détails de la masterclass",
        );
      }
    };

    fetchMasterclassDetails();
  }, [slug]);

  if (!masterclass) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-6 py-12">
      {/* En-tête de la masterclass */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-md border p-2">
            <img
              src={masterclass.image || `${BASE_URL}${masterclass.imageUrl}`}
              alt={masterclass.title}
              className="h-[400px] w-full object-cover"
            />
          </div>

          {/* Colonne de droite avec les informations principales */}
          <div className="space-y-6 self-center">
            <Typography variant="h2" className="text-2xl font-bold">
              {masterclass.title}
            </Typography>

            {/* Compte à rebours */}
            <div className="rounded-lg bg-blue-50 p-4">
              <Typography variant="h6" className="mb-2">
                Début de la masterclass dans :
              </Typography>
              <Countdown targetDate={masterclass.startDate} />
            </div>

            {/* Informations clés */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-gray-900" />
                <Typography>
                  {new Date(masterclass.startDate).toLocaleDateString()}
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-gray-900" />
                <Typography>
                  <FormatHour masterclass={masterclass} />
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-gray-900" />
                <Typography>
                  {masterclass.maxParticipants} participants max
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="h-5 w-5 text-blue-gray-900" />
                <Typography>{masterclass.price}</Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Hourglass className="h-5 w-5 text-blue-gray-900" />
                <Typography>
                  <CalculateDuration
                    startDate={masterclass.startDate}
                    endDate={masterclass.endDate}
                  />
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarClock className="h-5 w-5 text-blue-gray-900" />
                <Typography>
                  {masterclass.duration}h durer de la réunion
                </Typography>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <Button className="w-full">S'inscrire à la masterclass</Button>
          </div>
        </div>

        {/* Description détaillée */}
        <Card className="mt-12">
          <CardBody>
            <Typography variant="h4" className="px-2">
              À propos de cette masterclass
            </Typography>
            <ReactQuill
              value={masterclass.description}
              readOnly={true}
              theme="bubble"
              className="text-gray-700"
            />
          </CardBody>
        </Card>

        {/* Instructeur */}
        <Card className="mt-8">
          <CardBody>
            <Typography variant="h4" className="mb-4">
              Votre instructeur
            </Typography>
            <div className="flex items-center space-x-4">
              <img
                src="https://live.themewild.com/eventu/assets/img/schedule/01.jpg"
                alt={masterclass.instructor?.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <Typography variant="h6">
                  {masterclass.instructor?.name} Dony Paul
                </Typography>
                <Typography className="text-gray-600">
                  {masterclass.instructor?.bio} Je suis un expert en
                  programmation et je suis passionné par les technologies
                  d'information et de communication.
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MasterclassDetail;
