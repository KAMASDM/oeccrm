import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/auth-boxed.css";
import "./assets/css/main.css";
import "./assets/css/dash_1.css";
import "./assets/css/perfect-scrollbar.css";
import "./assets/css/structure.css";
import "./assets/css/waves.min.css";
import "./assets/css/custom.css";
import Login from "./pages/Login";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Base from "./components/Base";
import EditEnquiry from "./pages/Enquiry/EditEnquiry";
import Enquiries from "./pages/Enquiry/Enquiries";
import Applications from "./pages/Application/Applications";
import CreateEnquiry from "./pages/Enquiry/CreateEnquiry";
import CreateApplication from "./pages/Application/CreateApplication";
import EditApplication from "./pages/Application/EditApplication";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoot from "./components/AuthRoot";
import UserProfile from "./pages/User";
import ErrorPage from "./pages/ErrorPage";
import Search from "./pages/Search";
import University from "./pages/University";
import ErrorBoundary from "./components/ErrorBoundry";
import StudentDashboard from "./pages/StudentDashboard";
import { useEffect } from "react";
import Enquriy from "./pages/Enquriy";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Base />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "enquiries",
          element: <Enquiries />,
        },
        {
          path: "enquiry",
          element: <Navigate to="/enquiries" replace />,
        },
        {
          path: "enquiry/edit",
          element: <Navigate to="/enquiries" replace />,
        },
        {
          path: "enquiry/create/",
          element: <CreateEnquiry />,
        },
        {
          path: "enquiry/edit/:enquiryId",
          element: <EditEnquiry />,
        },
        {
          path: "student",
          element: <Navigate to="/enquiries" replace />,
        },
        {
          path: "student/:enqId",
          element: <StudentDashboard />,
        },
        {
          path: "applications",
          element: <Applications createApp={true} />,
        },
        {
          path: "application",
          element: <Navigate to="/applications" replace />,
        },
        {
          path: "application/edit",
          element: <Navigate to="/applications" replace />,
        },
        {
          path: "application/create/:appID?",
          element: <CreateApplication />,
        },
        {
          path: "application/edit/:appId",
          element: <EditApplication />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "website-enquiry",
          element: <Enquriy />,
        },
        {
          path: "university",
          element: <University />,
        },
      ],
    },
    {
      path: "login",
      element: (
        <AuthRoot>
          <Login />
        </AuthRoot>
      ),
      errorElement: <ErrorPage />,
    },
  ],
  { basename: "/oeccrm" }
);
const tele = window.Telegram.WebApp;
function App() {
  useEffect(() => {
    tele.ready();
  });
  return (
    <>
      <ErrorBoundary>
        <RouterProvider router={router}></RouterProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
