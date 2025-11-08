import './App.css'
import Layout from './layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router'

function App() {

  const routes = createBrowserRouter([
    {
      path: '/', element: <Layout /> /*,children=[ 
      {path:'/', element: <HomePage />} // add pages to children نحط الصفحة زي الصفحة الرئيسية في 
    ]*/}
  ])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
