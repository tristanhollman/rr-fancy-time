import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import { IconButton, Tooltip } from "@mui/material";
import { CanvasControls } from "../shared/CanvasControls";
import { useLocalStorage } from "usehooks-ts";

export const SakuraControls = () => {
  const [isDevMode, setDevMode] = useLocalStorage<boolean>("devMode", false);

  return (
    <CanvasControls>
      <Tooltip title="Go to earth times view" placement="left">
        <IconButton href="/globe">
          <TravelExploreIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Dev Mode" placement="left">
        <IconButton onClick={() => setDevMode(!isDevMode)}>
          <LogoDevIcon />
        </IconButton>
      </Tooltip>
    </CanvasControls>
  );
};
