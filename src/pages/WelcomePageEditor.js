// WelcomePageEditor.js
import React, { useEffect, useState } from "react";
import WelcomePage from "./WelcomePage";
import { saveWelcomePageConfig } from "../helpers/cafeHelpers"; // Import the API function
import Switch from "react-switch"; // Import react-switch
import "./WelcomePageEditor.css";
import { getImageUrl } from "../helpers/itemHelper.js";

const WelcomePageEditor = ({ cafeId, welcomePageConfig }) => {
  const [image, setImage] = useState("");
  const [welcomingText, setWelcomingText] = useState("Enjoy your coffee!");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [isWelcomePageActive, setIsWelcomePageActive] = useState(false); // State for the switch
  const [loading, setLoading] = useState(false); // Loading state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load existing welcome page configuration when component mounts
  useEffect(() => {
    if (welcomePageConfig) {
      const config = JSON.parse(welcomePageConfig);
      setImage(getImageUrl(config.image) || ""); // Load image path
      setWelcomingText(config.welcomingText || "Enjoy your coffee!");
      setBackgroundColor(config.backgroundColor || "#ffffff");
      setTextColor(config.textColor || "#000000");
      setIsWelcomePageActive(config.isWelcomePageActive === "true"); // Convert string to boolean
    }
    console.log(welcomePageConfig);
  }, [welcomePageConfig]);

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
      isWelcomePageActive, // Include the isWelcomePageActive state
    };

    try {
      const result = await saveWelcomePageConfig(cafeId, details);
      console.log("Configuration saved:", result);
    } catch (error) {
      console.error("Error saving configuration:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "10px" }}>Is Welcome Page Active:</label>
          <Switch
            onChange={() => setIsWelcomePageActive(!isWelcomePageActive)}
            checked={isWelcomePageActive}
            offColor="#888"
            onColor="#0a0"
            uncheckedIcon={false}
            checkedIcon={false}
          />
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
          onGetStarted={() => setIsFullscreen(false)}
          isFullscreen={isFullscreen}
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
