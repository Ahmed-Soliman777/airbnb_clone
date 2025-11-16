import ListingCarousel from "@/components/Listing/ListingCarousel";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import Layout from "./layout/Layout";
import ListingDetails from "./Pages/ListingDetails";
import Home from "./Pages/Home";
import store from "./store/store";
import { Provider } from "react-redux";
import NotFound from "./Pages/NotFound";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "homes", element: <Home /> },
        { path: "room/:id", element: <ListingDetails /> },
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
