import "./App.css";
import Layout from "./layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import Listing from "@/components/Listing/Listing";
import ListingCarousel from "@/components/Listing/ListingCarousel";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "listing",
          element: <Listing />,
        },
        {
          path: "homes",
          element: <ListingCarousel />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
