import styles from "@/styles/Shared.module.css";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

export const CanvasControls = ({ children }: { children: ReactNode }) => {
  return <Stack className={`${styles.controls}`}>{children}</Stack>;
};
