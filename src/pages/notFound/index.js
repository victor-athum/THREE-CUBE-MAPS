import React from "react";

const athumLogo = require("../../assets/athum.png");

const NotFoundPage = () => (
  <div className="h-100 d-flex flex-column justify-content-center align-items-center">
    <img src={athumLogo} alt="logo hum" />
    <h2>Out of HUM?</h2>
  </div>
);

export default NotFoundPage;
