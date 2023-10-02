import AutoModeIcon from "@mui/icons-material/AutoMode";
import SpaIcon from "@mui/icons-material/Spa";
import { IconButton, Tooltip } from "@mui/material";
import { CanvasControls } from "../shared/CanvasControls";

export const GlobeControls = ({
  autoRotateCallback,
}: {
  autoRotateCallback: () => void;
}) => {
  return (
    <CanvasControls>
      <Tooltip title="Toggle auto rotation" placement="left">
        <IconButton onClick={() => autoRotateCallback()}>
          <AutoModeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Go to sakura view" placement="left">
        <IconButton href="/">
          <SpaIcon />
        </IconButton>
      </Tooltip>
    </CanvasControls>
  );
};
