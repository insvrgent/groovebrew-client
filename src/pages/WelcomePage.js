// WelcomePage.js
import React from "react";
import "./WelcomePage.css";

const WelcomePage = ({
  onGetStarted,
  isFullscreen,
  image,
  welcomingText,
  backgroundColor,
  textColor,
}) => {
  return (
    <div
      className={`welcome-page ${isFullscreen ? "fullscreen" : ""}`} // Corrected the className syntax
      style={{
        backgroundColor,
      }}
    >
      <div
        style={{
          backgroundColor: image ? "transparent" : "black",
        }}
        className="image-container"
      >
        {image && <img src={image} alt="Welcome" className="circular-image" />} {/* Added conditional rendering */}
      </div>
      <h1 className="welcoming-text" style={{ color: textColor }}>
        {welcomingText}
      </h1>
      <button className="get-started-button" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default WelcomePage;
