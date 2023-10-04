import { useDevMode } from "@/hooks/useDevMode";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import DeveloperBoardOffIcon from "@mui/icons-material/DeveloperBoardOff";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { IconButton, Tooltip } from "@mui/material";
import { CanvasControls } from "../shared/CanvasControls";

export const SakuraControls = () => {
  const [isDevMode, setDevMode] = useDevMode();
  const [showMusicPanel, setShowMusicPanel] = useMusicPlayer();

  return (
    <CanvasControls>
      <Tooltip title="Toggle Music Panel" placement="left">
        <IconButton onClick={() => setShowMusicPanel(!showMusicPanel)}>
          {!showMusicPanel ? <MusicNoteIcon /> : <MusicOffIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Go to earth times view" placement="left">
        <IconButton href="./globe">
          <TravelExploreIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Dev Mode" placement="left">
        <IconButton onClick={() => setDevMode(!isDevMode)}>
          {!isDevMode ? <LogoDevIcon /> : <DeveloperBoardOffIcon />}
        </IconButton>
      </Tooltip>
    </CanvasControls>
  );
};
