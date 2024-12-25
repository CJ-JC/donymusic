import { Button, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ArrowBack } from "@mui/icons-material";
import Table from "@/widgets/utils/Table";
import axios from "axios";
import { loggedOut } from "@/reducer/auth";
import { useDispatch, useSelector } from "react-redux";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMainAdminPage = location.pathname === "/administrator";

  const [courses, setCourses] = useState([]);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn || (user && user.role !== "admin")) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/course");
        const sortedCourses = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        ); // Trier par date décroissante
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };

    fetchCourses();
  }, []);

  const logout = () => {
    axios.post("/api/user/logout");
    dispatch(loggedOut());
    navigate("/");
    window.location.reload();
  };

  if (!isLoggedIn || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <aside
        id="cta-button-sidebar"
        className={`fixed inset-y-0 z-50 h-full w-80 flex-col border-r bg-white shadow-sm transition-transform duration-300
		${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm">
          <div className="flex h-20 w-full items-center p-4">
            <Typography
              variant="h5"
              className="font-semibold"
              color="blue-gray"
            >
              dzedf
            </Typography>
            <CloseIcon
              className={`absolute right-4 top-6 h-6 w-6 rounded-sm text-gray-500 opacity-70 transition-colors hover:text-gray-700 md:opacity-0 ${
                isSidebarOpen ? "cursor-pointer" : "disabled"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <ul className="w-full p-2 font-medium">
            <li>
              <a
                href="#"
                className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className="mx-auto h-screen max-w-screen-xl">
        <div className="inset-x-0 top-0 z-40 mx-auto flex h-20 max-w-screen-xl items-center justify-between border-b bg-white p-4">
          <Link to="/" className="hidden h-14 w-auto md:block">
            <img src="/img/logo-day.svg" alt="logo" className="h-14 w-auto" />
          </Link>
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-5">
            <Link to={"/administrator"}>
              <button className="flex items-center text-gray-900 focus:outline-none">
                <ArrowBack className="mr-1 h-4 w-4" /> Retour
              </button>
            </Link>

            <Button
              onClick={logout}
              variant="outlined"
              size="sm"
              color="red"
              className="flex items-center focus:outline-none"
            >
              <LogOut className="mr-1 h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </div>
        <div className="mx-auto flex h-screen flex-col pb-20 xl:max-w-7xl">
          <div className="m-2">
            {isMainAdminPage ? (
              <>
                <Typography
                  variant="h3"
                  className="mb-3 font-bold"
                  color="blue-gray"
                >
                  Liste des formations
                </Typography>
                <div>
                  <Table courses={courses} />
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
