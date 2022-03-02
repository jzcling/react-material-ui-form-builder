import { useEffect, useState } from "react";

import { useMediaQuery } from "@mui/material";
import { Breakpoint, useTheme } from "@mui/material/styles";

function useDimensions(): {
  widthType: Breakpoint;
  width: number;
  height: number;
} {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys];
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

  const widthType = keys.reduce((output: Breakpoint, key: Breakpoint) => {
    let query = theme.breakpoints.up(key);
    let matches = useMediaQuery(query);
    return matches ? key : output;
  }, "xs");

  return {
    widthType,
    ...windowDimensions,
  };
}

function getWindowDimensions(): {
  width: number;
  height: number;
} {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export { useDimensions };
