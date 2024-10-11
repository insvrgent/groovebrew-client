import React, { useState, useRef, useEffect } from "react";
import "./RouletteWheel.css";
import coffeeImage from "./coffee.png"; // Update the path to your image

import { ThreeDots } from "react-loader-spinner";

const RouletteWheel = ({ isForRegister, onSignIn, onSignUp }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);
  const wheelRef = useRef(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const emailInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleSignIn = () => {
    setError(false); // Reset error state before login attempt
    onSignIn(email, username, password, setLoading, setError);
  };

  const handleSignUp = () => {
    setError(false); // Reset error state before login attempt
    onSignUp(email, username, password, setLoading, setError);
  };
  const handleStart = (x, y) => {
    setIsDragging(true);
    startAngleRef.current = getAngle(x, y);
    startRotationRef.current = rotation;
  };

  useEffect(() => {
    setError(false);
  }, [error]);

  const handleMove = (x, y) => {
    if (isDragging) {
      const angle = getAngle(x, y);
      const deltaAngle = angle - startAngleRef.current;
      setRotation(startRotationRef.current + deltaAngle);
      if (isForRegister) {
        if (rotation + deltaAngle > 30 || rotation + deltaAngle < -210)
          handleEnd();
      } else {
        if (rotation + deltaAngle > 30 || rotation + deltaAngle < -120)
          handleEnd();
      }
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setRotation((prevRotation) => {
      const snappedRotation = Math.round(prevRotation / 90) * 90;
      return snappedRotation;
    });
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    handleEnd();
  };

  const handleChildMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleChildTouchStart = (e) => {
    e.stopPropagation();
  };

  const getAngle = (x, y) => {
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const inputPositions = [-90, 0, 90, 180]; // Positions for the inputs

  const isVisible = (angle) => {
    const modAngle = ((angle % 360) + 360) % 360;
    return modAngle % 90 === 0;
  };

  useEffect(() => {
    if (isForRegister) {
      if (isVisible(rotation % 360 !== -0)) {
        emailInputRef.current.focus();
      } else if (isVisible(rotation % 360 !== -90)) {
        usernameInputRef.current.focus();
      } else if (isVisible(rotation % 360 !== -180)) {
        passwordInputRef.current.focus();
      }
    } else {
      if (isVisible(rotation % 360 !== -0)) {
        usernameInputRef.current.focus();
      } else if (isVisible(rotation % 360 !== -90)) {
        passwordInputRef.current.focus();
      }
    }
  }, [rotation]);

  return (
    <div className="roulette-wheel-container">
      <div
        className="roulette-wheel"
        ref={wheelRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <input
          className={`roulette-input ${
            isVisible(rotation % 360 !== -0) ? "" : "hidden"
          }`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameInputRef}
          style={{ transform: "translate(60%, -220%) rotate(0deg)" }}
        />
        <input
          className={`roulette-input ${
            isVisible(rotation % 360 !== -0) ? "" : "hidden"
          }`}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          style={{ transform: "translate(90%, -90%) rotate(0deg)" }}
        />
        <button
          className={`roulette-button  ${error ? "error" : ""}  ${
            isVisible(rotation % 360 !== -0) ? "" : "hidden"
          }`}
          disabled={loading}
          onClick={handleSignIn}
          onMouseDown={handleChildMouseDown}
          onTouchStart={handleChildTouchStart}
          style={{ transform: "translate(110%, -10%) rotate(0deg)" }}
        >
          {loading ? (
            <ThreeDots color="black" height={15} width={40} /> // Show loader when loading
          ) : (
            "Sign in"
          )}
        </button>
        <input
          className={`roulette-input ${
            isVisible(rotation % 360 !== -90) ? "" : "hidden"
          }`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailInputRef}
          style={{ transform: "translate(30%, 320%) rotate(90deg)" }}
        />
        <input
          className={`roulette-input ${
            isVisible(rotation % 360 !== -90) ? "" : "hidden"
          }`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameInputRef}
          style={{ transform: "translate(10%, 320%) rotate(90deg)" }}
        />
        <input
          className={`roulette-input ${
            isVisible(rotation % 360 !== -90) ? "" : "hidden"
          }`}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          style={{ transform: "translate(-10%, 320%) rotate(90deg)" }}
        />
        <button
          className={`roulette-button  ${error ? "error" : ""} ${
            isVisible(rotation % 360 !== -90) ? "" : "hidden"
          } `}
          onClick={handleSignUp}
          onMouseDown={handleChildMouseDown}
          onTouchStart={handleChildTouchStart}
          style={{ transform: "translate(-60%, 320%) rotate(90deg)" }}
        >
          {loading ? (
            <ThreeDots color="black" height={15} width={40} /> // Show loader when loading
          ) : (
            "Sign Up"
          )}
        </button>
        <img src={coffeeImage} className="roulette-image" alt="Coffee" />
      </div>
    </div>
  );
};

export default RouletteWheel;
