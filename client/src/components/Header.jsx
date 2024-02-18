import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import HighlightIcon from "@mui/icons-material/Highlight";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

function Header() {
  const navigate = useNavigate();
  const logout = useSignOut();
  const isAuth = useIsAuthenticated();
  const location = useLocation();

  return (
    <div>
      <nav className="navbar navbar-expand-lg text-bg-warning">
        <div className="container my-1">
          <a className="navbar-brand" href="/">
            <HighlightIcon />
            Keeper
          </a>

          {isAuth() && (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#myNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="offcanvas offcanvas-start"
                id="myNav"
                tabIndex={-1}
                data-bs-scroll="true"
              >
                <div className="offcanvas-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                  ></button>
                </div>

                <div className="offcanvas-body">
                  <ul className="navbar-nav nav-underline ms-auto align-items-center">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          location.pathname === "/home" && "active"
                        }`}
                        href="/home"
                      >
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="/"
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
