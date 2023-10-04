import { useLocalStorage } from "usehooks-ts";

export function useMusicPlayer(): [boolean, (value: boolean) => void] {
  const [showMusicPanel, setShowMusicPanel] = useLocalStorage<boolean>(
    "showMusicPanel",
    false
  );

  return [showMusicPanel, setShowMusicPanel];
}
