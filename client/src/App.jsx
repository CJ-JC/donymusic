import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import { Home, Profile, SignIn, SignUp } from "@/pages";
import Detail from "./components/detail";
import CoursePlayer from "./dashboard/course-player";
import { Courses } from "@/pages/courses";
import Admin from "./pages/admin/admin";
import CreateCourse from "./pages/admin/course/create-course";
import NotFound from "./pages/404";
import CreateWebinar from "./pages/admin/create-webinar";
import EditCourse from "./pages/admin/course/edit-course";
import CreateChapter from "./pages/admin/course/create-chapter";
import EditChapter from "./pages/admin/course/edit-chapter";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      {/* Routes principales */}
      <Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="detail/slug/:id" element={<Detail />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
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
        <Route path="create-webinar" element={<CreateWebinar />} />
      </Route>

      {/* Autres routes */}
      <Route
        path="/course-player/course/:courseId/chapters/:chapterId"
        element={<CoursePlayer />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
