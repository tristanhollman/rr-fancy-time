import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import SpaIcon from "@mui/icons-material/Spa";
import { IconButton, Tooltip } from "@mui/material";
import { CanvasControls } from "../shared/CanvasControls";

export const GlobeControls = ({
  autoRotateCallback,
}: {
  autoRotateCallback: () => void;
}) => {
  const [showMusicPanel, setShowMusicPanel] = useMusicPlayer();

  return (
    <CanvasControls>
      <Tooltip title="Toggle Music Panel" placement="left">
        <IconButton onClick={() => setShowMusicPanel(!showMusicPanel)}>
          {!showMusicPanel ? <MusicNoteIcon /> : <MusicOffIcon />}
        </IconButton>
      </Tooltip>
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
