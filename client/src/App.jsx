import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Footer, Navbar } from "@/widgets/layout";
import routes from "@/routes";

function App() {
  const { pathname } = useLocation();

  const isCoursePlayerPath =
    /^\/course-player\/course\/\d+\/chapters\/\d+$/.test(pathname);

  return (
    <>
      {!isCoursePlayerPath && (
        // <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
        //   <Navbar routes={routes} />
        // </div>
        <div className="inset-y-0 z-[49] mx-auto h-[80px] w-full bg-black">
          <div className="flex h-full items-center gap-x-4 border-b p-4">
            <div className="container z-10 mx-auto max-w-screen-xl">
              <Navbar routes={routes} />
            </div>
          </div>
        </div>
      )}

      <Routes>
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />,
        )}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {!isCoursePlayerPath && <Footer />}
    </>
  );
}

export default App;
