import { useState, useEffect } from "react";
import axios from "axios";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [availableRemises, setAvailableRemises] = useState([]);
  const [discountedCourses, setDiscountedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/course");

        // Filtrer uniquement les cours publiés
        const publishedCourses = response.data.filter(
          (course) => course.isPublished,
        );

        // Trier les cours publiés par date de création
        const sortedCourses = publishedCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setCourses(sortedCourses);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get("/api/remise");
        const remises = response.data;

        const globalRemise = remises.find((remise) => remise.isGlobal);
        if (globalRemise) {
          setGlobalDiscount(globalRemise.discountPercentage);
        }

        const specificRemises = remises.filter((remise) => !remise.isGlobal);
        setAvailableRemises(specificRemises);
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    fetchRemises();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      const updatedCourses = courses.map((course) => {
        let discountedPrice = course.price;

        // Appliquer la remise globale
        if (globalDiscount) {
          discountedPrice =
            course.price - (course.price * globalDiscount) / 100;
        }

        // Appliquer la remise spécifique
        const specificRemise = availableRemises.find(
          (remise) => remise.courseId === course.id,
        );
        if (specificRemise) {
          discountedPrice =
            course.price -
            (course.price * specificRemise.discountPercentage) / 100;
        }

        return {
          ...course,
          discountedPrice: parseFloat(discountedPrice).toFixed(2),
        };
      });

      // Mettre à jour les cours avec remises
      setDiscountedCourses(updatedCourses);
    }
  }, [courses, globalDiscount, availableRemises]);

  return { courses, discountedCourses, globalDiscount, availableRemises };
};

export default useCourses;
