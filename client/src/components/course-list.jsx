import React, { useEffect, useState } from "react";
import CourseCard from "./course-card";
import axios from "axios";

const courseList = ({ courses }) => {
  // const [courses, setCourses] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get("/api/course")
  //     .then((res) => {
  //       setCourses(res.data);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors de la récupération des cours", error);
  //     });
  // }, []);

  return (
    <>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          imageUrl={course.imageUrl}
          chaptersLength={course.chapters.length}
          price={course.price}
          videoUrl={course.videoUrl}
          slug={course.slug}
        />
      ))}

      {courses.length === 0 && (
        <p className="text-muted-foreground mt-10 text-center text-sm">
          Aucune formation trouvée
        </p>
      )}
    </>
  );
};

export default courseList;
