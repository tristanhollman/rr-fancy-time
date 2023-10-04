import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

export const Camera = () => {
  const [isDevMode] = useLocalStorage("devMode", false);

  const options = useMemo(() => {
    return {
      moveable: isDevMode,
    };
  }, [isDevMode]);

  const cameraOptions = useControls("Camera", options);

  return (
    <OrbitControls
      enablePan={cameraOptions.moveable}
      enableRotate={cameraOptions.moveable}
      enableZoom={cameraOptions.moveable}
      target={[0, 0, 0]}
      makeDefault={true}
    />
  );
};
