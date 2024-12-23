import React, { useEffect, useState } from "react";
import CourseList from "@/components/course-list";
import axios from "axios";
import SearchInput from "@/components/search/search-input";
import Categories from "@/components/search/categories";

export function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("/api/course")
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des cours", error);
      });
  }, []);

  const categories = [
    { id: "1", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "2", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "3", name: "Basse", icon: "/img/basse.svg" },
    { id: "4", name: "Piano", icon: "/img/piano.svg" },
  ];

  return (
    <section className="mx-auto h-screen max-w-screen-xl px-4 py-5">
      <div className="container mx-auto">
        {/* <Typography
          variant="h3"
          className="mb-6 text-center font-bold"
          color="blue-gray"
        >
          Découvrez notre catalogue complet de formations
        </Typography> */}
        <div className="block py-6 pt-6 md:mb-0 md:hidden">
          <SearchInput />
        </div>
        <div className="max-md:justify-center flex">
          <div className="mr-5 hidden md:block">
            <SearchInput />
          </div>
          <Categories items={categories} />
        </div>
        <div className="my-5 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <CourseList courses={courses} />
        </div>
      </div>
    </section>
  );
}

export default Courses;
