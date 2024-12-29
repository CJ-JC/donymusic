import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import Detail from "./components/detail";
import CoursePlayer from "./dashboard/course-player";
import { Courses } from "@/pages/Courses";
import Admin from "./pages/admin/admin";
import CreateCourse from "./pages/admin/course/create-course";
import NotFound from "./pages/404";
import CreateWebinar from "./pages/admin/create-webinar";
import EditCourse from "./pages/admin/course/edit-course";
import CreateChapter from "./pages/admin/course/create-chapter";
import EditChapter from "./pages/admin/course/edit-chapter";
import Home from "./pages/home";
import Profile, { Account } from "./pages/user/Account";
import CoursesUser from "./pages/user/Courses";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import Remise from "./components/Remise";
import ShowCourses from "./pages/admin/course/show-courses";
import axios from "axios";
import Loading from "./widgets/utils/Loading";

const Layout = ({ hasGlobalDiscount, discountPercentage }) => (
  <>
    {hasGlobalDiscount && (
      <div className="border-orange-30 text-primary text-md flex w-full items-center justify-center border bg-orange-700/80 p-4">
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
          className="lucide lucide-triangle-alert mr-2 h-4 w-4"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
        Bénéficiez de {discountPercentage}% de réductions sur les cours de votre
        choix.
      </div>
    )}
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const [hasGlobalDiscount, setHasGlobalDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const fetchRemises = async () => {
      try {
        const response = await axios.get("/api/remise");
        const remises = response.data;

        // Vérifiez s'il existe une remise globale
        const globalRemise = remises.find((remise) => remise.isGlobal);
        setHasGlobalDiscount(!!globalRemise);
        setDiscountPercentage(globalRemise.discountPercentage);
        setAuthLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des remises :", error);
      }
    };

    fetchRemises();
  }, []);

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto h-screen">
      <Routes>
        {/* Routes principales */}
        <Route
          path="/"
          element={
            <Layout
              hasGlobalDiscount={hasGlobalDiscount}
              discountPercentage={discountPercentage}
            />
          }
        >
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="detail/slug/:id" element={<Detail />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>

        {/* Routes admin */}
        <Route path="/administrator" element={<Admin />}>
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="create-chapter/:courseId" element={<CreateChapter />} />
          <Route
            path="course/:courseId/edit-chapter/:id"
            element={<EditChapter />}
          />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="remise" element={<Remise />} />
          <Route path="courses" element={<ShowCourses />} />
          <Route path="create-webinar" element={<CreateWebinar />} />
        </Route>

        <Route path="/user/account" element={<Account />}>
          <Route path="profile" element={<Profile />} />
          <Route path="my-courses" element={<CoursesUser />} />
        </Route>

        {/* Autres routes */}
        <Route
          path="/course-player/course/:courseId/chapters/:chapterId"
          element={<CoursePlayer />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

{
  /* <div className="mx-auto h-screen">
  <Navbar />
  <Routes>

    <Route>
      <Route index element={<Home />} />
      <Route path="courses" element={<Courses />} />
      <Route path="detail/slug/:id" element={<Detail />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
    </Route>



    <Route path="/administrator" element={<Admin />}>
      <Route path="create-course" element={<CreateCourse />} />
      <Route path="create-chapter/:courseId" element={<CreateChapter />} />
      <Route
        path="course/:courseId/edit-chapter/:id"
        element={<EditChapter />}
      />
      <Route path="edit-course/:id" element={<EditCourse />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path="create-webinar" element={<CreateWebinar />} />
    </Route>

    <Route path="/user/account" element={<Account />}>
      <Route path="profile" element={<Profile />} />
      <Route path="my-courses" element={<CoursesUser />} />
    </Route>


    <Route
      path="/course-player/course/:courseId/chapters/:chapterId"
      element={<CoursePlayer />}
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
  <Footer />
</div>; */
}
