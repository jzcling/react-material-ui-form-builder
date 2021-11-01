import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

function useDimensions() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const widthType = keys.reduce((output, key) => {
    var query = theme.breakpoints.up(key);
    if (key === "xs") {
      query = theme.breakpoints.down(key);
    }

    var matches = useMediaQuery(query);
    return !output && matches ? key : output;
  }, null);

  return {
    widthType: widthType,
    ...windowDimensions,
  };
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export { useDimensions };
