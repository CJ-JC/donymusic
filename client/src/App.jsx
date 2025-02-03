import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import CoursePlayer from "@/dashboard/Course-player.jsx";
import { Courses } from "@/pages/Courses.jsx";
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
import axios from "axios";
import Loading from "@/widgets/utils/Loading.jsx";
import Masterclass from "@/pages/admin/masterclass/Show-masterclass.jsx";
import MasterClass from "@/components/Masterclass.jsx";
import MasterclassDetail from "@/components/Masterclass-detail.jsx";
import CreateMasterclass from "@/pages/admin/masterclass/create-masterclass.jsx";
import EditMasterclass from "@/pages/admin/masterclass/Edit-masterclass.jsx";
import Coursedetail from "@/components/Course-detail.jsx";
import ScrollToTop from "@/widgets/utils/ScrollToTop.jsx";
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
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="detail/slug/:id" element={<Coursedetail />} />
          <Route path="masterclass" element={<MasterClass />} />
          <Route
            path="masterclass/slug/:slug"
            element={<MasterclassDetail />}
          />
          <Route path="/invoice-pdf" element={<InvoicePdf />} />

          {/* compte */}
          <Route path="user/account" element={<Account />} />
          <Route path="user/account/settings" element={<Setting />} />

          {/* s'authentifier */}
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* payment */}
          <Route path="success" element={<Success />} />
        </Route>

        {/* Routes admin */}
        <Route
          path="/administrator"
          element={<Admin toggleTheme={toggleTheme} theme={theme} />}
        >
          {/* Chapters */}
          <Route path="create-chapter/:courseId" element={<CreateChapter />} />
          <Route
            path="course/:courseId/edit-chapter/:id"
            element={<EditChapter />}
          />
          {/* Courses */}
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="courses" element={<ShowCourses />} />
          {/* Masterclass */}
          <Route path="masterclass" element={<Masterclass />} />
          <Route path="create-masterclass" element={<CreateMasterclass />} />
          <Route path="edit-masterclass/:id" element={<EditMasterclass />} />
          {/* instructors */}
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructor/create" element={<CreateInstructor />} />
          <Route path="instructor/edit/:id" element={<EditInstructor />} />
          {/* users */}
          <Route path="users" element={<Users />} />

          <Route path="profile" element={<AccountAdmin />} />
          {/* remise */}
          <Route path="remise" element={<Remise />} />
        </Route>

        {/* Autres routes */}
        <Route
          path="/course-player/course/:courseId/chapters/:chapterId"
          element={<CoursePlayer toggleTheme={toggleTheme} theme={theme} />}
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

{
  /* <h1>What is a webinar description?</h1><p><br></p><p>The webinar description is a piece of text that introduces the thematic scope of your webinar to your audience, and it's probably one of the most vital parts of your promotion strategy. You can do an outstanding social media campaign, do great email marketing, and prepare a marvelous presentation, but without a webinar description that grabs attention, you're not going to&nbsp;convince people to hit the "participate" button.</p><p><br></p><p>You can write a description of your&nbsp;webinar's title, subject, as the agenda, and any special activities&nbsp;that you've prepared for your attendees are essential. This is the only way to show how valuable the content that you're going to present is. With gripping text, you can make your webinar stand out from the crowd.</p><p><br></p><h2>What should a description include?</h2><p class="ql-align-justify">Here is some principal information that the webinar description should convey. Forgetting about some of them might cause misunderstandings and result in one of two scenarios. First, a person may send you a direct message asking about the missing details. Second, which is more likely and far worse for your business, a user could abandon your event and forget about it altogether.</p><p>To avoid such situations, you should write a description that includes the following points:</p><ul><li class="ql-align-justify"><strong>Set the time and date.</strong>&nbsp;It will also be visible in the event parameters, but to make everything crystal clear, it's good practice to add a note about the exact timing of the webinar. And although everything takes place online, you can show where exactly the event will be hosted from.</li><li class="ql-align-justify"><strong>Show the purpose of the webinar.</strong>&nbsp;People don't have much time to waste, and they seek ready-to-implement solutions. Although most of us spend some leisure moments scrolling social media or staring pointlessly at the TV, we still want to feel that if we spend an hour watching a live video then it will improve our life. So when you're writing a webinar description, make sure to show viewers how they can benefit from it.</li></ul> */
}
