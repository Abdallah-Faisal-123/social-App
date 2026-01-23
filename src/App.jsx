import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Postdetails from "./pages/Postdetails/Postdetails";
import Notfound from "./pages/Notfound/Notfound";
import Settings from "./pages/Settings/Settings";
import Layout from "./pages/Layout/Layout";
import { Bounce, ToastContainer } from "react-toastify";
import AuthProvider from "./component/Authcontext/Authcontext";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import AuthProtector from "./component/AuthProtector/AuthProtector";
import Chat from "./pages/Chat/chat";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <ProtectedRoute><Home/></ProtectedRoute> },
        { path: "signup", element: <AuthProtector><Signup /></AuthProtector> },
        { path: "login", element: <AuthProtector><Login /></AuthProtector> },
        { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "/postdetails/:id", element: <ProtectedRoute><Postdetails /></ProtectedRoute> },
        { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
        { path: "settings", element: <ProtectedRoute><Settings/></ProtectedRoute> },
        { path: "*", element: <Notfound /> },
      ],
    },
  ]);

  return (
   <div className="bg-gray-200">
        <AuthProvider >
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </AuthProvider>
   </div>
  );
}

export default App;