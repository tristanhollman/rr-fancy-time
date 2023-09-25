import { Html, useProgress } from "@react-three/drei";

export const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <>
      <Html center style={{ color: "white" }}>
        {progress} % loaded
      </Html>
    </>
  );
};
