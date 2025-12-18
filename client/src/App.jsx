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
<<<<<<< HEAD
import SearchListing from "./Pages/SearchListing";
import AirbnbLanding from "./Pages/AirbnbLanding";
=======
import ResetPassword from "./Pages/ResetPassword";
import ProfilePage from "./Pages/Profile";
import AirbnbLanding from "./Pages/AirbnbLanding"
>>>>>>> 03ed4663785aba8e6e442815a9a7eaadb40efedc
import AuthGuard from "./components/guards/AuthGuard";
import ExperienceSearchPage from "./Pages/ExperienceSearchPage";
import ServiceSearchPage from "./Pages/ServiceSearchPage";
import HostWelcomePage from "./Pages/HostWelcomePage";
import HostDashboardPage from "./Pages/HostDashboardPage";
import CheckoutPage from "./Pages/CheckoutPage";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";
import PaymentCancelPage from "./Pages/PaymentCancelPage";
import ReservationsPage from "./Pages/ReservationsPage";
import MessagesPage from "./Pages/MessagesPage"
import EditExperiencePage from "./Pages/EditExperiencePage";
import EditServicePage from "./Pages/EditServicePage";
import LandingPage from "./Pages/AirbnbLanding";
import HostWalletPage from "./Pages/HostWalletPage";
import HostGuestsPage from "./Pages/HostGuestsPage";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "homes", element: <Home /> },
        { path: "search", element: <SearchListing /> },
        { path: "room/:id", element: <ListingDetails /> },
        { path: "signup", element: <RegisterStep1 /> },
        { path: "register", element: <RegisterStep2 /> },
        { path: "login", element: <Login /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
         { path: "profile", element: <ProfilePage /> },
        {
          path: "signup",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <RegisterStep1 />
            </AuthGuard>
          ),
        },
        {
          path: "register",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <RegisterStep2 />
            </AuthGuard>
          ),
        },
        {
          path: "login",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <Login />
            </AuthGuard>
          ),
        },
        {
          path: "forget-password",
          element: (
            <AuthGuard requireAuth={false} redirectTo="/">
              <ForgetPassword />
            </AuthGuard>
          ),
        },

        { path: "help", element: <Help /> },

        {
          path: "host",
          element: (
            <AuthGuard requireAuth={true}>
              <Host />
            </AuthGuard>
          ),
        },
        {
          path: "host/welcome",
          element: (
            <AuthGuard requireAuth={true}>
              <HostWelcomePage />
            </AuthGuard>
          ),
        },
        {
          path: "host/dashboard",
          element: (
            <AuthGuard requireAuth={true}>
              <HostDashboardPage />
            </AuthGuard>
          ),
        },
        {
          path: "host/experiences/edit/:id",
          element: (
            <AuthGuard requireAuth={true}>
              <EditExperiencePage />
            </AuthGuard>
          )
        },
        {
          path: "host/services/edit/:id",
          element: (
            <AuthGuard requireAuth={true}>
              <EditServicePage />
            </AuthGuard>
          )
        },
        {
          path: "messages",
          element: (
            <AuthGuard requireAuth={true}>
              <MessagesPage />
            </AuthGuard>
          )
        },
        {
          path: "checkout",
          element: (
            <AuthGuard requireAuth={true}>
              <CheckoutPage />
            </AuthGuard>
          )
        },
        {
          path: "reservations",
          element: (
            <AuthGuard requireAuth={true}>
              <ReservationsPage />
            </AuthGuard>
          )
        },
        {
          path: "host/guests",
          element: (
            <AuthGuard requireAuth={true}>
              <HostGuestsPage />
            </AuthGuard>
          )
        },
        {
          path: "host/wallet",
          element: (
            <AuthGuard requireAuth={true}>
              <HostWalletPage />
            </AuthGuard>
          )
        },
        { path: "payment/success", element: <PaymentSuccessPage /> },
        { path: "payment/cancel", element: <PaymentCancelPage /> },
        { path: "experiences", element: <ExperiencesPage /> },
        { path: "experiences/:id", element: <ExperienceDetailsPage /> },
        { path: "services", element: <ServicesPage /> },
        { path: "services/:id", element: <ServiceDetailsPage /> },
        { path: "AirbnbLanding", element: <AirbnbLanding /> },
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
