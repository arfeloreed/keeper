import React from "react";
// import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Error() {
  // const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="text-bg-danger min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="text-center">
          <img
            src="images/404.gif"
            className="rounded img-fluid"
            style={{ width: "650px" }}
            alt="404 gif"
          />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-center mt-5 display-3">Oops!</h1>
          <p className="lead">
            The page you are looking for might have been removed, had its name changed or
            is temporarily unavailable.
          </p>
          <button className="btn btn-light btn-lg" onClick={() => navigate("/")}>
            HOMEPAGE
          </button>
        </div>
      </div>

      {/* {error ? (
        <div className="mt-5 text-center">
          <p>Sorry, an unexpected error had occured.</p>
          <i>{error.statusText || error.message}</i>
        </div>
      ) : (
        <p>Page not found.</p>
      )} */}
    </div>
  );
}

export default Error;
