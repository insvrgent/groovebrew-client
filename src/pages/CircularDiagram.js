import React from "react";

const CircularDiagram = ({ segments }) => {
  const radius = 100; // Radius of the circle
  const strokeWidth = 30; // Width of each portion
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);

  let startOffset = 0; // Initial offset for each segment

  const svgStyles = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      style={svgStyles}
    >
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke="#eee"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {segments.map((segment, index) => {
        const { percentage, color } = segment;
        const segmentLength = (circumference * percentage) / 100;
        const strokeDashoffset = circumference - startOffset;

        startOffset += segmentLength;

        return (
          <circle
            key={index}
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${segmentLength} ${
              circumference - segmentLength
            }`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" // Rounds the edges of each segment
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        );
      })}
    </svg>
  );
};

export default CircularDiagram;
