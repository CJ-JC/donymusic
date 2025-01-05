import { UserCircle2 } from "lucide-react";
import React from "react";

const Infos = ({ courses }) => {
  const numberOfCoursesPublished = courses.filter(
    (course) => course.isPublished,
  ).length;

  const numberOfCoursesNotPublished = courses.filter(
    (course) => !course.isPublished,
  ).length;

  return (
    <div className="grid grid-cols-1 gap-6 space-x-3 md:grid-cols-2 lg:grid-cols-3">
      <div className="border-slate-200 w-86 relative my-6 flex flex-col rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center">
          <UserCircle2 className="h-6 w-6" />
          <h5 className="text-slate-800 ml-1 text-lg font-semibold">
            Total clients
          </h5>
        </div>
        <p className="text-slate-600 mb-4 block font-light leading-normal">
          Because it&apos;s about motivating the doers. Because I&apos;m here to
          follow my dreams and inspire others.
        </p>
        <div>
          <a
            href="#"
            className="text-slate-800 flex items-center text-sm font-semibold hover:underline"
          >
            Learn More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="border-slate-200 w-86 relative my-6 flex flex-col rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="text-slate-600 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <h5 className="text-slate-800 ml-1 text-lg font-semibold">
            Formations
          </h5>
        </div>
        <p className="text-slate-600 mb-2 block font-light leading-normal">
          {numberOfCoursesPublished > 1
            ? numberOfCoursesPublished + " Formations publiées"
            : numberOfCoursesPublished + " Formation publiée"}
        </p>
        <p className="text-slate-600 mb-2 block font-light leading-normal">
          {numberOfCoursesNotPublished > 1
            ? numberOfCoursesNotPublished + " Formations non publiées"
            : numberOfCoursesNotPublished + " Formation non publiée"}
        </p>
      </div>
    </div>
  );
};

export default Infos;
