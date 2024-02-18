import React, { useContext } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
// context
import { KeeperContext } from "../context/KeeperContext";
// components
import Header from "../components/Header";
import Heading from "../components/Heading";
import Login from "../components/Login";
import Register from "../components/Register";
import Footer from "../components/Footer";

function LandingPage() {
  const { showRegister } = useContext(KeeperContext);
  const isAuth = useIsAuthenticated();

  return (
    <div className="bg">
      <Header />
      <Heading />

      {isAuth() ? (
        <div className="d-flex justify-content-center my-5 container">
          <img
            src="images/landing-page.gif"
            className="rounded bg-gif"
            alt="spongebob-gif"
          />
        </div>
      ) : showRegister ? (
        <Register />
      ) : (
        <Login />
      )}

      <Footer />
    </div>
  );
}

export default LandingPage;
