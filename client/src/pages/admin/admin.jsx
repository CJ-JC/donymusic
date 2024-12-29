import { Button, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { Discount } from "@mui/icons-material";
import axios from "axios";
import { loggedOut } from "@/reducer/auth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import Loading from "@/widgets/utils/Loading";
import ShowCourses from "./course/show-courses";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMainAdminPage = location.pathname === "/administrator";

  const [courses, setCourses] = useState([]);
  // const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/course");
        const sortedCourses = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
    };

    // if (!authLoading && isLoggedIn && user.role === "admin") {
    fetchCourses();
    // }
  }, []);
  // }, [authLoading, isLoggedIn, user]);

  const logout = () => {
    axios.post("/api/user/logout");
    dispatch(loggedOut());
    navigate("/");
  };

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // if (!isLoggedIn || !user || user.role !== "admin") {
  //   return navigate("/");
  // }

  return (
    <div>
      {/* ici */}
      <aside
        id="cta-button-sidebar"
        className={`fixed inset-y-0 z-50 h-full w-80 flex-col border-r bg-white shadow-sm transition-transform duration-300
		${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
		md:block md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-screen flex-col overflow-y-auto border-r bg-white shadow-sm">
          <div className="flex h-20 w-full items-center border-b p-4">
            <Typography
              variant="h5"
              className="text-center font-semibold"
              color="blue-gray"
            >
              Administrateur
            </Typography>
            <CloseIcon
              className={`absolute right-4 top-6 h-6 w-6 rounded-sm text-gray-500 opacity-70 transition-colors hover:text-gray-700 md:opacity-0 ${
                isSidebarOpen ? "cursor-pointer" : "disabled"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <ul className="h-screen w-full p-2 font-medium">
            <li>
              <NavLink
                to={"/administrator"}
                end
                className={({ isActive }) =>
                  `group flex items-center rounded-lg p-2 ${
                    isActive
                      ? "bg-gray-500 font-medium"
                      : "bg-white font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <svg
                  className="h-5 w-5 flex-shrink-0 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="ms-3">Formations</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/administrator/remise"}
                end
                className={({ isActive }) =>
                  `group flex items-center rounded-lg p-2 ${
                    isActive
                      ? "bg-gray-500 font-medium"
                      : "bg-white font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <Discount />
                <span className="ms-3">Remise</span>
              </NavLink>
            </li>
          </ul>
          <hr />
          <ul className="my-5 flex justify-center">
            <Button
              onClick={logout}
              variant="outlined"
              size="sm"
              color="red"
              className="flex items-center focus:outline-none"
            >
              <LogOut className="mr-1 h-4 w-4" /> Déconnexion
            </Button>
          </ul>
        </div>
      </aside>

      <div className="h-full md:pl-80">
        <div className="sticky inset-x-0 top-0 z-40 flex h-20 w-full items-center justify-between border-b bg-white p-4">
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
          <div className="flex items-center space-x-3">
            <Link to={"/administrator"}>
              <Button
                variant="outlined"
                size="sm"
                fullWidth
                className="flex items-center"
              >
                <LogOut className="mr-1 h-4 w-4" /> Retour
              </Button>
            </Link>
            <Link to="/">
              <Button variant="gradient" size="sm" fullWidth>
                Accueil
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto flex flex-col pb-20 xl:max-w-7xl">
          <div className="m-4">
            {isMainAdminPage ? (
              <div className="h-screen">
                <ShowCourses courses={courses} />
              </div>
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
