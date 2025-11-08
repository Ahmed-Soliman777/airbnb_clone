import "./App.css";
import Layout from "./layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import Listing from "@/components/Listing/Listing";

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
