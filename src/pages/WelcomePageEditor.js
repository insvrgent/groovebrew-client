// WelcomePageEditor.js
import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import { saveWelcomePageConfig } from "../helpers/cafeHelpers"; // Import the API function
import "./WelcomePageEditor.css";

const WelcomePageEditor = () => {
  const [image, setImage] = useState("");
  const [welcomingText, setWelcomingText] = useState("Enjoy your coffee!");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [loading, setLoading] = useState(false); // Loading state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store the base64 image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e) => {
    setWelcomingText(e.target.value);
  };

  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);

    const details = {
      image,
      welcomingText,
      backgroundColor,
      textColor,
    };

    try {
      const result = await saveWelcomePageConfig(details);
      console.log("Configuration saved:", result);
    } catch (error) {
      console.error("Error saving configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isFullscreen)
    return (
      <WelcomePage
        image={image}
        welcomingText={welcomingText}
        backgroundColor={backgroundColor}
        textColor={textColor}
        isFullscreen={true}
        onGetStarted={() => setIsFullscreen(false)}
      />
    );

  return (
    <div
      className="welcome-page-editor"
      style={{ width: "80vw", height: "80vh" }}
    >
      <h2>Edit Welcome Page</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <textarea
          value={welcomingText}
          onChange={handleTextChange}
          placeholder="Enter welcoming text..."
          style={{ height: "20px", resize: "none" }} // Reduced height
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>
            Background Color:
            <input
              type="color"
              value={backgroundColor}
              onChange={handleColorChange}
            />
          </label>
          <label>
            Text Color:
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
            />
          </label>
        </div>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </div>
      <div
        style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}
      >
        <WelcomePage
          image={image}
          welcomingText={welcomingText}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
        <div style={{ position: "absolute", bottom: 0, right: 0 }}>
          <svg
            width="100" // Adjust size as needed
            height="100" // Adjust size as needed
            style={{ position: "absolute", bottom: 0, right: 0 }}
            onClick={() => setIsFullscreen(true)}
          >
            <g transform="rotate(45 50 50)">
              <circle cx="50" cy="50" r="40" fill="rgba(0, 0, 0, 0.5)" />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fill="white" // Adjust text color as needed
              >
                &lt;&gt;
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomePageEditor;
