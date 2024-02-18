import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";

function Heading() {
  return (
    <div className="container text-light">
      <div className="mt-5 text-center">
        <h1 className="display-1 fw-medium">
          <HighlightIcon sx={{ fontSize: 70 }} />
          Keeper
        </h1>
        <p className="h3 mt-5 w-50 mx-auto">
          I know your lazy and always tired. So let me keep your important notes for you
          safely.
        </p>
      </div>
    </div>
  );
}

export default Heading;
