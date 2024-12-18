import { Home, Profile, SignIn, SignUp } from "@/pages";
import Detail from "./components/detail";
import CoursePlayer from "./dashboard/course-player";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "course",
    path: "/detail/slug/:id",
    element: <Detail />,
  },
  {
    name: "course-player",
    path: "/course-player/course/:courseId/chapters/:chapterId",
    element: <CoursePlayer />,
  },
  {
    name: "Sign In",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    name: "Sign Up",
    path: "/sign-up",
    element: <SignUp />,
  },
];

export default routes;
