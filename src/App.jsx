import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import UserProfile from "./pages/UserProfile/UserProfile";
import Postdetails from "./pages/Postdetails/Postdetails";
import Notfound from "./pages/Notfound/Notfound";
import Settings from "./pages/Settings/Settings";
import Layout from "./pages/Layout/Layout";
import { Bounce, ToastContainer } from "react-toastify";
import AuthProvider from "./component/Authcontext/Authcontext";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import AuthProtector from "./component/AuthProtector/AuthProtector";
import Chat from "./pages/Chat/chat";
import Notifications from "./pages/Notifications/Notifications";


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
        { path: "user/:id", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
        { path: "postdetails/:id", element: <ProtectedRoute><Postdetails /></ProtectedRoute> },
        { path: "chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
        { path: "settings", element: <ProtectedRoute><Settings/></ProtectedRoute> },
        { path: "notifications", element: <ProtectedRoute><Notifications/></ProtectedRoute> },
        { path: "*", element: <Notfound /> },
      ],
    },
  ]);

  return (
   <div className="min-h-screen bg-slate-50">
        <AuthProvider >
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        toastClassName="!rounded-2xl !shadow-xl !font-medium !text-sm"
      />
    </AuthProvider>
   </div>
  );
}

export default App;