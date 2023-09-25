import styles from "@/styles/SakuraScene.module.css";
import { Button } from "@mui/material";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva } from "leva";
import { Suspense } from "react";
import * as THREE from "three";
import { useLocalStorage, useToggle } from "usehooks-ts";
import { CanvasLoader } from "../shared/CanvasLoader";
import { SoundCloudPlayer } from "../shared/SoundCloudPlayer";
import { FlyingPetals } from "./FlyingPetals";

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
    </>
  );
}

const StaticCamera = () => {
  return (
    <OrbitControls
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
      target={[0, 0, 0]}
      makeDefault={true}
    />
  );
};

const Background = () => {
  const { scene } = useThree();
  const texture = useLoader(
    THREE.TextureLoader,
    "./sakura-wallpaper-upscaled-01.png"
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  scene.background = texture;

  return (
    <>
      <ambientLight color="white" intensity={1} />
      <EffectComposer>
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};
