import { useDevMode } from "@/hooks/useDevMode";
import styles from "@/styles/SakuraScene.module.css";
import { Button } from "@mui/material";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";
import { useToggle } from "usehooks-ts";
import { CanvasLoader } from "../shared/CanvasLoader";
import { SoundCloudPlayer } from "../shared/SoundCloudPlayer";
import { Background } from "./Background";
import { Camera } from "./Camera";
import { FlyingPetals } from "./FlyingPetals";
import { SakuraControls } from "./SakuraControls";

export default function StaticSakuraScene() {
  const [isDevMode] = useDevMode();
  const [isStarted, toggle] = useToggle(false);

  if (!isStarted) {
    return (
      <>
        <div className={`${styles.startContainer}`}>
          <div>
            <h2>Hey there!</h2>
            <br />
            <p>
              Welcome to my submission for the Mini Hackathon Challenge:
              &quot;Shaping Real-Time with React&quot;
            </p>
            <p>
              Where I decided to just mess around with WebGL (using three.js) to
              make something fancy.
            </p>
          </div>
          <Button size="large" onClick={toggle} variant="contained">
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
        camera={{ position: [0, 2, 10] }}
        className={`${styles.backgroundCanvas}`}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Background />
          <Camera />
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
