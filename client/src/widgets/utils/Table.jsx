import { Button } from "@material-tailwind/react";
import { PencilIcon, PlusCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Table = ({ courses }) => {
  const isPublished = false;
  return (
    <>
      <div className="flex-column mb-4 flex flex-wrap items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="relative">
          <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0">
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search for items"
          />
        </div>
        <div>
          <Link to={"/administrator/create-course"}>
            <Button
              variant="gradient"
              size="sm"
              className="flex items-center text-white focus:outline-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle formation
            </Button>
          </Link>
        </div>
      </div>
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-300 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Titre
            </th>
            <th scope="col" className="px-6 py-3">
              Prix
            </th>
            <th scope="col" className="px-6 py-3">
              État
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr
              key={index}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {course.title}
              </th>
              <td className="px-6 py-4">{course.price}€</td>
              <td className="px-6 py-4">
                {course.isPublished ? (
                  <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                    Publié
                  </span>
                ) : (
                  <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Non publié
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <Link
                  to={`/administrator/edit-course/${course.id}`}
                  className="flex w-min items-center gap-1 rounded-lg border p-1 font-medium text-black hover:bg-gray-200 dark:text-blue-500"
                >
                  <PencilIcon className="h-4 w-4 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
