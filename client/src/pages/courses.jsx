import React, { useEffect, useState } from "react";
import CourseList from "@/components/Course-list";
import SearchInput from "@/components/search/search-input";
import Categories from "@/components/search/categories";
import useCourses from "@/widgets/utils/UseCourses";
import axios from "axios";
import usePagination from "@/widgets/utils/usePagination";

export function Courses() {
  // const [filteredCourses, setFilteredCourses] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);

  // const coursesPerPage = 8;

  // const { courses, discountedCourses, globalDiscount, availableRemises } =
  //   useCourses();

  // const handleSearch = (event) => {
  //   const query = event.target.value;
  //   setSearchQuery(query);

  //   // Filter courses based on the search query
  //   const filtered = courses.filter((course) =>
  //     course.title.toLowerCase().includes(query.toLowerCase()),
  //   );

  //   setFilteredCourses(filtered);
  //   setCurrentPage(1);
  // };

  // // Get current courses for the current page
  // const indexOfLastCourse = currentPage * coursesPerPage;
  // const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  // const currentCourses = filteredCourses.slice(
  //   indexOfFirstCourse,
  //   indexOfLastCourse,
  // );

  // // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const categories = [
    { id: "1", name: "Guitare", icon: "/img/guitare.svg" },
    { id: "2", name: "Batterie", icon: "/img/batterie.svg" },
    { id: "3", name: "Basse", icon: "/img/basse.svg" },
    { id: "4", name: "Piano", icon: "/img/piano.svg" },
  ];

  const { courses, discountedCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = discountedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Utiliser le hook de pagination
  const { currentItems, currentPage, totalPages, paginate } = usePagination(
    filteredCourses,
    8,
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    paginate(1);
  };

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="">
        {/* Search bar */}
        <div className="block py-6 pt-6 md:mb-0 md:hidden">
          <SearchInput handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
        <div className="max-md:justify-center flex">
          <div className="mr-5 hidden md:block">
            <SearchInput
              handleSearch={handleSearch}
              searchQuery={searchQuery}
            />
          </div>
          <Categories items={categories} />
        </div>

        {/* Course list */}
        {/* <CourseList courses={currentCourses} /> */}

        <div className="h-screen">
          <CourseList courses={currentItems} />
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav>
            <ul className="inline-flex space-x-1">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`border px-4 py-2 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Précédent
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1}>
                  <button
                    onClick={() => paginate(i + 1)}
                    className={`border px-4 py-2 ${
                      currentPage === i + 1
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`border px-4 py-2 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default Courses;
