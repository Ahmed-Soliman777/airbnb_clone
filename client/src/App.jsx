import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import Layout from "./layout/Layout";
import ListingDetails from "./Pages/ListingDetails";
import Home from "./Pages/Home";
import store from "./store/store";
import { Provider } from "react-redux";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Login";
import ForgetPassword from "./Pages/ForgetPassword";
import RegisterStep1 from "./Pages/RegisterStep1";
import RegisterStep2 from "./Pages/RegisterStep2";
import Help from "./Pages/Help";
import Host from "./Pages/Host";
import ExperiencesPage from "./Pages/ExperiencePage";
import ExperienceDetailsPage from "./Pages/ExperienceDetailsPage";
import ServicesPage from "./Pages/ServicesPage";
import ServiceDetailsPage from "./Pages/ServiceDetailsPage";
import AirbnbLanding from "./Pages/AirbnbLanding"
import AuthGuard from "./components/guards/AuthGuard";
import ExperienceSearchPage from "./Pages/ExperienceSearchPage";
import ServiceSearchPage from "./Pages/ServiceSearchPage";
import HostWelcomePage from "./pages/HostWelcomePage";
import HostDashboardPage from "./pages/HostDashboardPage";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "homes", element: <Home /> },
        { path: "room/:id", element: <ListingDetails /> },

        {
          path: "signup",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <RegisterStep1 />
            </AuthGuard>
          )
        },
        {
          path: "register",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <RegisterStep2 />
            </AuthGuard>
          )
        },
        {
          path: "login",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <Login />
            </AuthGuard>
          )
        },
        {
          path: "forget-password",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <ForgetPassword />
            </AuthGuard>
          )
        },

        { path: "help", element: <Help /> },

        {
          path: "host",
          element: (
            <AuthGuard requireAuth={true}>
              <Host />
            </AuthGuard>
          )
        },
        {
          path: "host/welcome",
          element: (
            <AuthGuard requireAuth={true}>
              <HostWelcomePage />
            </AuthGuard>
          )
        },
        {
          path: "host/dashboard",
          element: (
            <AuthGuard requireAuth={true}>
              <HostDashboardPage />
            </AuthGuard>
          )
        },

        { path: "experiences", element: <ExperiencesPage /> },
        { path: "experiences/:id", element: <ExperienceDetailsPage /> },
        { path: "services", element: <ServicesPage /> },
        { path: "services/:id", element: <ServiceDetailsPage /> },
            { path: "AirbnbLanding", element: <AirbnbLanding/> },
        { path: "experiences/search", element: <ExperienceSearchPage /> },
        { path: "services/search", element: <ServiceSearchPage /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </>
  );
}

export default App;
