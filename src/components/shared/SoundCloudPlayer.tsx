import { useMusicPlayer } from "@/hooks/useMusicPlayer";

export const SoundCloudPlayer = () => {
  const [showMusicPanel] = useMusicPlayer();

  if (!showMusicPanel) {
    return null;
  }

  return (
    <iframe
      title="soundcloud player"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/872442853&color=%23ff5500&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
      style={{ display: "none" }}
    ></iframe>
  );
};
