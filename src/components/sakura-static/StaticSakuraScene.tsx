import styles from "@/styles/SakuraScene.module.css";
import { Button } from "@mui/material";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";
import { useLocalStorage, useToggle } from "usehooks-ts";
import { CanvasLoader } from "../shared/CanvasLoader";
import { SoundCloudPlayer } from "../shared/SoundCloudPlayer";
import { Background } from "./Background";
import { FlyingPetals } from "./FlyingPetals";
import { StaticCamera } from "./StaticCamera";
import { SakuraControls } from "./SakuraControls";

export default function StaticSakuraScene() {
  const [isDevMode] = useLocalStorage("devMode", false);
  const [isStarted, toggle] = useToggle(false);

  if (!isStarted) {
    return (
      <>
        <div className={`${styles.startContainer}`}>
          <Button
            size="large"
            onClick={toggle}
            variant="contained"
            style={{ margin: "auto" }}
          >
            Start
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10] }}
        className={`${styles.backgroundCanvas}`}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Background />
          <StaticCamera />
          <FlyingPetals />
          {isDevMode && <Stats />}
        </Suspense>
      </Canvas>
      <Leva hidden={!isDevMode} collapsed />
      <SoundCloudPlayer />
      <SakuraControls />
    </>
  );
}
