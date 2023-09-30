import styles from "@/styles/GlobeScene.module.css";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { IconButton, Stack, Tooltip } from "@mui/material";

export const GlobeControls = ({
  autoRotateCallback,
}: {
  autoRotateCallback: () => void;
}) => {
  return (
    <Stack className={`${styles.globeControls}`}>
      <Tooltip title="Toggle auto rotation">
        <IconButton onClick={() => autoRotateCallback()}>
          <AutoModeIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
