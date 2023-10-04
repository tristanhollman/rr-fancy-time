import { useEffect, useState } from "react";

/**
 * Simple fullscreen hook implementation, does not work together with F11 => https://stackoverflow.com/a/21118401
 */
export function useFullscreen(): [boolean, () => Promise<void>] {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const close = async () => {
    if (
      isFullscreen &&
      document.fullscreenElement === document.documentElement
    ) {
      await document.exitFullscreen();
    }
  };

  const open = async () => {
    if (document.fullscreenEnabled && !isFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  };

  const setFullscreen = async (state: boolean) => {
    return state ? await open() : await close();
  };

  const toggleFullscreen = async () => {
    await setFullscreen(!isFullscreen);
  };

  // Update the state of the hook if the full screenstate is changed outside of the React application.
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === document.documentElement);
    };

    document.addEventListener("fullscreenchange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
    };
  }, []);

  return [isFullscreen, toggleFullscreen];
}
