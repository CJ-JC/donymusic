import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import Loading from "@/widgets/utils/Loading.jsx";
import ScrollToTop from "@/widgets/utils/ScrollToTop.jsx";
import axios from "axios";
import CoursePlayer from "./dashboard/CoursePlayer.jsx";
import Courses from "./pages/Courses.jsx";
import Admin from "@/pages/admin/Admin.jsx";
import CreateCourse from "@/pages/admin/course/Create-course.jsx";
import NotFound from "@/pages/404.jsx";
import EditCourse from "@/pages/admin/course/Edit-course.jsx";
import CreateChapter from "@/pages/admin/course/Create-chapter.jsx";
import EditChapter from "@/pages/admin/course/Edit-chapter.jsx";
import Home from "@/pages/home.jsx";
import Account from "@/pages/user/Account.jsx";
import SignIn from "@/pages/auth/sign-in.jsx";
import SignUp from "@/pages/auth/sign-up.jsx";
import Remise from "@/pages/admin/Remise.jsx";
import ShowCourses from "@/pages/admin/course/Show-courses.jsx";
import Masterclass from "@/pages/admin/masterclass/Show-masterclass.jsx";
import MasterClass from "@/components/Masterclass.jsx";
import MasterclassDetail from "@/components/Masterclass-detail.jsx";
import CreateMasterclass from "@/pages/admin/masterclass/create-masterclass.jsx";
import EditMasterclass from "@/pages/admin/masterclass/Edit-masterclass.jsx";
import Coursedetail from "@/components/Course-detail.jsx";
import CreateInstructor from "@/pages/admin/instructor/create-instructor.jsx";
import Instructors from "@/pages/admin/instructor/Instructors.jsx";
import EditInstructor from "@/pages/admin/instructor/edit-instructor.jsx";
import Users from "@/pages/admin/Users/Users.jsx";
import AccountAdmin from "@/pages/admin/Users/Account-admin.jsx";
import Setting from "@/pages/user/Settings.jsx";
import Success from "@/pages/Success.jsx";
import InvoicePdf from "@/pages/user/Invoice-pdf.jsx";
import ForgotPassword from "@/pages/auth/forgot-password.jsx";
import ResetPassword from "@/pages/auth/reset-password.jsx";
import Politique from "@/pages/Politique.jsx";
import Cgu from "@/pages/cgu.jsx";
import Cgv from "@/pages/Cgv.jsx";

// Lazy imports
const CoursePlayerLazy = lazy(() => import("./dashboard/CoursePlayer.jsx"));
const CoursesLazy = lazy(() => import("./pages/Courses.jsx"));
const AdminLazy = lazy(() => import("@/pages/admin/Admin.jsx"));
const CreateCourseLazy = lazy(() =>
  import("@/pages/admin/course/Create-course.jsx"),
);
const EditCourseLazy = lazy(() =>
  import("@/pages/admin/course/Edit-course.jsx"),
);
const CreateChapterLazy = lazy(() =>
  import("@/pages/admin/course/Create-chapter.jsx"),
);
const EditChapterLazy = lazy(() =>
  import("@/pages/admin/course/Edit-chapter.jsx"),
);
const HomeLazy = lazy(() => import("@/pages/home.jsx"));
const AccountLazy = lazy(() => import("@/pages/user/Account.jsx"));
const SignInLazy = lazy(() => import("@/pages/auth/sign-in.jsx"));
const SignUpLazy = lazy(() => import("@/pages/auth/sign-up.jsx"));
const RemiseLazy = lazy(() => import("@/pages/admin/Remise.jsx"));
const ShowCoursesLazy = lazy(() =>
  import("@/pages/admin/course/Show-courses.jsx"),
);
const MasterclassLazy = lazy(() =>
  import("@/pages/admin/masterclass/Show-masterclass.jsx"),
);
const MasterClassLazy = lazy(() => import("@/components/Masterclass.jsx"));
const MasterclassDetailLazy = lazy(() =>
  import("@/components/Masterclass-detail.jsx"),
);
const CreateMasterclassLazy = lazy(() =>
  import("@/pages/admin/masterclass/create-masterclass.jsx"),
);
const EditMasterclassLazy = lazy(() =>
  import("@/pages/admin/masterclass/Edit-masterclass.jsx"),
);
const CoursedetailLazy = lazy(() => import("@/components/Course-detail.jsx"));

const Layout = ({
  globalDiscount,
  discountPercentage,
  isExpired,
  toggleTheme,
  theme,
  timeLeft,
}) => (
  <>
    {!isExpired && globalDiscount && (
      <div className="text-md flex w-full items-center justify-center bg-orange-700/60 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-triangle-alert mr-1 h-4 w-4"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
        Bénéficiez de {discountPercentage}% de réductions sur les cours de votre
        choix.{" "}
        <span className="ml-1 font-bold">
          ⏳ Offre expire dans : {timeLeft}
        </span>
      </div>
    )}
    <Navbar toggleTheme={toggleTheme} theme={theme} />
    <Outlet />
    <Footer toggleTheme={toggleTheme} theme={theme} />
  </>
);

function App() {
  const [globalDiscount, setGlobalDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Fonction pour calculer le temps restant
  const calculateTimeLeft = (expiryDate) => {
    const now = new Date();
    const difference = expiryDate - now;

    if (difference <= 0) {
      setIsExpired(true);
      return "Expiré";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return days > 0
      ? `${days}j ${hours}h ${minutes}m ${seconds}s`
      : `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get("/api/remise");
        const remises = response.data;

        if (!remises || remises.length === 0) {
          setGlobalDiscount(false);
          setDiscountPercentage(0);
          setIsExpired(false);
          setAuthLoading(false);
          return;
        }

        const globalRemise = remises.find((remise) => remise.isGlobal);

        if (globalRemise) {
          const expirationDate = new Date(globalRemise.expirationDate);
          const now = new Date();

          if (expirationDate > now) {
            setGlobalDiscount(true);
            setDiscountPercentage(globalRemise.discountPercentage);
            setIsExpired(false);
            setExpirationDate(expirationDate);
            setTimeLeft(calculateTimeLeft(expirationDate));
          } else {
            setGlobalDiscount(false);
            setDiscountPercentage(0);
            setIsExpired(true);
          }
        } else {
          setGlobalDiscount(false);
          setDiscountPercentage(0);
          setIsExpired(false);
        }

        setAuthLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération des remises :", error);
        setAuthLoading(false);
      }
    };

    fetchRemises();
  }, []);

  // Mise à jour du countdown toutes les secondes
  useEffect(() => {
    if (!expirationDate || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expirationDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate, isExpired]);

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto h-auto md:h-screen">
      <ScrollToTop />
      <Routes>
        {/* Routes principales */}

        <Route
          path="/"
          element={
            <Layout
              globalDiscount={globalDiscount}
              discountPercentage={discountPercentage}
              isExpired={isExpired}
              toggleTheme={toggleTheme}
              theme={theme}
              timeLeft={timeLeft}
            />
          }
        >
          <Route index element={<HomeLazy />} />
          <Route
            path="courses"
            element={
              <Suspense fallback={<Loading />}>
                <CoursesLazy />
              </Suspense>
            }
          />
          <Route path="detail/slug/:id" element={<CoursedetailLazy />} />
          <Route path="masterclass" element={<MasterClassLazy />} />
          <Route
            path="masterclass/slug/:slug"
            element={<MasterclassDetailLazy />}
          />
          <Route path="/invoice-pdf" element={<InvoicePdf />} />

          {/* compte */}
          <Route path="user/account" element={<AccountLazy />} />
          <Route path="user/account/settings" element={<Setting />} />

          {/* s'authentifier */}
          <Route path="sign-in" element={<SignInLazy />} />
          <Route path="sign-up" element={<SignUpLazy />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* payment */}
          <Route path="success" element={<Success />} />
        </Route>

        {/* Routes admin */}
        <Route
          path="/administrator"
          element={<AdminLazy toggleTheme={toggleTheme} theme={theme} />}
        >
          {/* Chapters */}
          <Route
            path="create-chapter/:courseId"
            element={<CreateChapterLazy />}
          />
          <Route
            path="course/:courseId/edit-chapter/:id"
            element={<EditChapterLazy />}
          />
          {/* Courses */}
          <Route path="create-course" element={<CreateCourseLazy />} />
          <Route path="edit-course/:id" element={<EditCourseLazy />} />
          <Route path="courses" element={<ShowCoursesLazy />} />
          {/* Masterclass */}
          <Route path="masterclass" element={<MasterclassLazy />} />
          <Route
            path="create-masterclass"
            element={<CreateMasterclassLazy />}
          />
          <Route
            path="edit-masterclass/:id"
            element={<EditMasterclassLazy />}
          />
          {/* instructors */}
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructor/create" element={<CreateInstructor />} />
          <Route path="instructor/edit/:id" element={<EditInstructor />} />
          {/* users */}
          <Route path="users" element={<Users />} />

          <Route path="profile" element={<AccountAdmin />} />
          {/* remise */}
          <Route path="remise" element={<RemiseLazy />} />
        </Route>

        {/* Autres routes */}
        <Route
          path="/course-player/course/:courseId/chapters/:chapterId"
          element={
            <Suspense fallback={<Loading />}>
              <CoursePlayerLazy toggleTheme={toggleTheme} theme={theme} />
            </Suspense>
          }
        />

        <Route path="*" element={<NotFound />} />

        {/* footer */}
        <Route path="politique" element={<Politique />} />
        <Route path="cgu" element={<Cgu />} />
        <Route path="cgv" element={<Cgv />} />
      </Routes>
    </div>
  );
}

export default App;
