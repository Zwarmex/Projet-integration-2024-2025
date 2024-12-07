import { Box } from "@mui/material";
import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const barColor = progress < 20 ? "bg-red-500" : "bg-main"; // Changer la couleur en rouge si progress est < 20
  return (
    <Box className="relative w-full h-2">
      <Box className="absolute w-full h-2 rounded-full bg-text"></Box>
      <Box
        className={`absolute h-2 rounded-full ${barColor}`} // Applique la couleur basée sur le stock
        style={{ width: `${progress}%` }}
      ></Box>
    </Box>
  );
};

export default ProgressBar;
