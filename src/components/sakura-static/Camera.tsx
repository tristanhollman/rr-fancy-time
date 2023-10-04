import { useDevMode } from "@/hooks/useDevMode";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo } from "react";

export const Camera = () => {
  const [isDevMode, setDevMode] = useDevMode();

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
