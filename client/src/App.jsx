import ListingCarousel from "@/components/Listing/ListingCarousel";
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

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "homes", element: <Home /> },
        { path: "room/:id", element: <ListingDetails /> },
        { path: "signup", element: <RegisterStep1 /> },
        { path: "register", element: <RegisterStep2 /> },
        { path: "login", element: <Login /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "help", element: <Help /> },
        { path: "host", element: <Host /> },
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
