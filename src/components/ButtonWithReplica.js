import React, { useState } from "react";
import "./ButtonWithReplica.css";

const ButtonWithReplica = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 1000); // Duration of the animation
  };

  return (
    <div className="container">
      <button className="button" onClick={handleClick}>
        {children}
      </button>
      <div className={`replica ${isActive ? "active" : ""}`}></div>
    </div>
  );
};

export default ButtonWithReplica;
