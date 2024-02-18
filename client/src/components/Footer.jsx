import React from "react";

function Footer({ color }) {
  const year = new Date().getFullYear();
  return (
    <div className={`text-center ${color ? color : "text-light"}`}>
      <p className="mb-0 pb-1">Copyright © {year} Arfelo Reed @ Keeper</p>
    </div>
  );
}

export default Footer;
