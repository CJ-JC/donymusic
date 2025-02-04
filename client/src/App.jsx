import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout/index.js";
import Loading from "@/widgets/utils/Loading.jsx";
import ScrollToTop from "@/widgets/utils/ScrollToTop.jsx";
import axios from "axios";

// Lazy imports
const CoursePlayer = lazy(() => import("./dashboard/CoursePlayer.jsx"));
const Courses = lazy(() => import("./pages/courses.jsx"));
const Admin = lazy(() => import("./pages/admin/admin.jsx"));
const CreateCourse = lazy(() =>
  import("./pages/admin/course/create-course.jsx"),
);
const EditCourse = lazy(() => import("./pages/admin/course/edit-course.jsx"));
const CreateChapter = lazy(() =>
  import("./pages/admin/course/create-chapter.jsx"),
);
const EditChapter = lazy(() => import("./pages/admin/course/edit-chapter.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const SignIn = lazy(() => import("@/pages/auth/sign-in.jsx"));
const SignUp = lazy(() => import("@/pages/auth/sign-up.jsx"));
const Remise = lazy(() => import("@/pages/admin/remise.jsx"));
const ShowCourses = lazy(() => import("@/pages/admin/course/show-courses.jsx"));
const Masterclass = lazy(() =>
  import("@/pages/admin/masterclass/show-masterclass.jsx"),
);
const MasterClass = lazy(() => import("@/components/Masterclass.jsx"));
const MasterclassDetail = lazy(() =>
  import("@/components/Masterclass-detail.jsx"),
);
const CreateMasterclass = lazy(() =>
  import("@/pages/admin/masterclass/create-masterclass.jsx"),
);
const EditMasterclass = lazy(() =>
  import("@/pages/admin/masterclass/edit-masterclass.jsx"),
);
const Coursedetail = lazy(() => import("@/components/Course-detail.jsx"));
const CreateInstructor = lazy(() =>
  import("@/pages/admin/instructor/create-instructor.jsx"),
);
const Instructors = lazy(() =>
  import("@/pages/admin/instructor/instructors.jsx"),
);
const EditInstructor = lazy(() =>
  import("@/pages/admin/instructor/edit-instructor.jsx"),
);
const Users = lazy(() => import("@/pages/admin/Users/users.jsx"));
const AccountAdmin = lazy(() =>
  import("@/pages/admin/Users/account-admin.jsx"),
);
const Account = lazy(() => import("@/pages/user/account.jsx"));
const Setting = lazy(() => import("@/pages/user/settings.jsx"));
const Success = lazy(() => import("@/pages/success.jsx"));
const InvoicePdf = lazy(() => import("@/pages/user/invoice-pdf.jsx"));
const ForgotPassword = lazy(() => import("@/pages/auth/Forgot-password.jsx"));
const ResetPassword = lazy(() => import("@/pages/auth/Reset-password.jsx"));
const Politique = lazy(() => import("@/pages/politique.jsx"));
const Cgu = lazy(() => import("@/pages/cgu.jsx"));
const Cgv = lazy(() => import("@/pages/cgv.jsx"));

// Wrapper pour le lazy loading
const LazyComponent = ({ component: Component, ...props }) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

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
          <Route index element={<LazyComponent component={Home} />} />
          <Route
            path="courses"
            element={<LazyComponent component={Courses} />}
          />
          <Route
            path="detail/slug/:id"
            element={<LazyComponent component={Coursedetail} />}
          />
          <Route
            path="masterclass"
            element={<LazyComponent component={MasterClass} />}
          />
          <Route
            path="masterclass/slug/:slug"
            element={<LazyComponent component={MasterclassDetail} />}
          />
          <Route
            path="/invoice-pdf"
            element={<LazyComponent component={InvoicePdf} />}
          />

          {/* compte */}
          <Route
            path="user/account"
            element={<LazyComponent component={Account} />}
          />
          <Route
            path="user/account/settings"
            element={<LazyComponent component={Setting} />}
          />

          {/* s'authentifier */}
          <Route
            path="sign-in"
            element={<LazyComponent component={SignIn} />}
          />
          <Route
            path="sign-up"
            element={<LazyComponent component={SignUp} />}
          />
          <Route
            path="forgot-password"
            element={<LazyComponent component={ForgotPassword} />}
          />
          <Route
            path="reset-password"
            element={<LazyComponent component={ResetPassword} />}
          />

          {/* payment */}
          <Route
            path="success"
            element={<LazyComponent component={Success} />}
          />
        </Route>

        {/* Routes admin */}
        <Route
          path="/administrator"
          element={
            <LazyComponent
              component={Admin}
              toggleTheme={toggleTheme}
              theme={theme}
            />
          }
        >
          {/* Chapters */}
          <Route
            path="create-chapter/:courseId"
            element={<LazyComponent component={CreateChapter} />}
          />
          <Route
            path="course/:courseId/edit-chapter/:id"
            element={<LazyComponent component={EditChapter} />}
          />

          {/* Courses */}
          <Route
            path="create-course"
            element={<LazyComponent component={CreateCourse} />}
          />
          <Route
            path="edit-course/:id"
            element={<LazyComponent component={EditCourse} />}
          />
          <Route
            path="courses"
            element={<LazyComponent component={ShowCourses} />}
          />

          {/* Masterclass */}
          <Route
            path="masterclass"
            element={<LazyComponent component={Masterclass} />}
          />
          <Route
            path="create-masterclass"
            element={<LazyComponent component={CreateMasterclass} />}
          />
          <Route
            path="edit-masterclass/:id"
            element={<LazyComponent component={EditMasterclass} />}
          />

          {/* instructors */}
          <Route
            path="instructors"
            element={<LazyComponent component={Instructors} />}
          />
          <Route
            path="instructor/create"
            element={<LazyComponent component={CreateInstructor} />}
          />
          <Route
            path="instructor/edit/:id"
            element={<LazyComponent component={EditInstructor} />}
          />

          {/* users */}
          <Route path="users" element={<LazyComponent component={Users} />} />
          <Route
            path="profile"
            element={<LazyComponent component={AccountAdmin} />}
          />

          {/* remise */}
          <Route path="remise" element={<LazyComponent component={Remise} />} />
        </Route>

        {/* Autres routes */}
        <Route
          path="/course-player/course/:courseId/chapters/:chapterId"
          element={
            <LazyComponent
              component={CoursePlayer}
              toggleTheme={toggleTheme}
              theme={theme}
            />
          }
        />

        <Route path="*" element={<LazyComponent component={NotFound} />} />

        {/* footer */}
        <Route
          path="politique"
          element={<LazyComponent component={Politique} />}
        />
        <Route path="cgu" element={<LazyComponent component={Cgu} />} />
        <Route path="cgv" element={<LazyComponent component={Cgv} />} />
      </Routes>
    </div>
  );
}

export default App;
