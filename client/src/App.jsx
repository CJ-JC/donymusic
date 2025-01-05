import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import CoursePlayer from "./dashboard/course-player";
import { Courses } from "@/pages/Courses";
import Admin from "./pages/admin/Admin";
import CreateCourse from "./pages/admin/course/Create-course";
import NotFound from "./pages/404";
import EditCourse from "./pages/admin/course/Edit-course";
import CreateChapter from "./pages/admin/course/Create-chapter";
import EditChapter from "./pages/admin/course/Edit-chapter";
import Home from "./pages/home";
import Profile, { Account } from "./pages/user/Account";
import CoursesUser from "./pages/user/Courses";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import Remise from "./components/Remise";
import ShowCourses from "./pages/admin/course/Show-courses";
import axios from "axios";
import Loading from "./widgets/utils/Loading";
import Masterclass from "./pages/admin/masterclass/Show-masterclass";
import MasterClass from "./components/Masterclass";
import MasterclassDetail from "./components/Masterclass-detail";
import CreateMasterclass from "./pages/admin/masterclass/create-masterclass";
import EditMasterclass from "./pages/admin/masterclass/Edit-masterclass";
import Coursedetail from "./components/Course-detail";
import ScrollToTop from "./widgets/utils/ScrollToTop";

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

        if (!remises || remises.length === 0) {
          setHasGlobalDiscount(false);
          setDiscountPercentage(0);
          setAuthLoading(false);
          return;
        }

        const globalRemise = remises.find((remise) => remise.isGlobal);

        setHasGlobalDiscount(!!globalRemise);
        setDiscountPercentage(
          globalRemise ? globalRemise.discountPercentage : 0,
        );

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
      <ScrollToTop />
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
          <Route path="detail/slug/:id" element={<Coursedetail />} />
          <Route path="masterclass" element={<MasterClass />} />
          <Route
            path="masterclass/slug/:slug"
            element={<MasterclassDetail />}
          />
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
          <Route path="masterclass" element={<Masterclass />} />
          <Route path="create-masterclass" element={<CreateMasterclass />} />
          <Route path="edit-masterclass/:id" element={<EditMasterclass />} />
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
  /* <h1>What is a webinar description?</h1><p><br></p><p>The webinar description is a piece of text that introduces the thematic scope of your webinar to your audience, and it's probably one of the most vital parts of your promotion strategy. You can do an outstanding social media campaign, do great email marketing, and prepare a marvelous presentation, but without a webinar description that grabs attention, you're not going to&nbsp;convince people to hit the "participate" button.</p><p><br></p><p>You can write a description of your&nbsp;webinar’s title, subject, as the agenda, and any special activities&nbsp;that you’ve prepared for your attendees are essential. This is the only way to show how valuable the content that you’re going to present is. With gripping text, you can make your webinar stand out from the crowd.</p><p><br></p><h2>What should a description include?</h2><p class="ql-align-justify">Here is some principal information that the webinar description should convey. Forgetting about some of them might cause misunderstandings and result in one of two scenarios. First, a person may send you a direct message asking about the missing details. Second, which is more likely and far worse for your business, a user could abandon your event and forget about it altogether.</p><p>To avoid such situations, you should write a description that includes the following points:</p><ul><li class="ql-align-justify"><strong>Set the time and date.</strong>&nbsp;It will also be visible in the event parameters, but to make everything crystal clear, it's good practice to add a note about the exact timing of the webinar. And although everything takes place online, you can show where exactly the event will be hosted from.</li><li class="ql-align-justify"><strong>Show the purpose of the webinar.</strong>&nbsp;People don't have much time to waste, and they seek ready-to-implement solutions. Although most of us spend some leisure moments scrolling social media or staring pointlessly at the TV, we still want to feel that if we spend an hour watching a live video then it will improve our life. So when you're writing a webinar description, make sure to show viewers how they can benefit from it.</li></ul> */
}
