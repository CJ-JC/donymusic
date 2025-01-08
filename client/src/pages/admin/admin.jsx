import { Button } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loggedOut } from "@/reducer/auth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "@/widgets/utils/CheckAuthStatus";
import Loading from "@/widgets/utils/Loading";
import Aside from "@/widgets/layout/aside";
import { LogOut } from "lucide-react";
import Dashboard from "./Dashboard";

const Admin = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMainAdminPage = location.pathname === "/administrator";

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch, authLoading, isLoggedIn, user]);

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

  if (!isLoggedIn || !user || user.role !== "admin") {
    return navigate("/");
  }

  return (
    <div>
      {/* ici */}
      <Aside
        logout={logout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="h-screen bg-[#f1f5f99f] md:pl-80">
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
                <Dashboard />
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
