import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { GoogleOAuthProvider } from "@react-oauth/google";
// context
import { KeeperContextProvider } from "./context/KeeperContext";
// routes
import LandingPage from "./routes/LandingPage";
import Home from "./routes/Home";
import Error from "./routes/Error";

function App() {
  // routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <Error />,
    },
    {
      path: "/home",
      element: (
        <RequireAuth fallbackPath={"/"}>
          <Home />
        </RequireAuth>
      ),
    },
  ]);
  const store = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
  });

  return (
    <div>
      <KeeperContextProvider>
        <AuthProvider store={store}>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </AuthProvider>
      </KeeperContextProvider>
    </div>
  );
}

export default App;
