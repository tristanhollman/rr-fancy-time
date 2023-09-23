import styles from "@/styles/Scene.module.css";
import { Button } from "@mui/material";
import { Html, OrbitControls, Stats, useProgress } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva } from "leva";
import { Suspense } from "react";
import * as THREE from "three";
import { useLocalStorage, useToggle } from "usehooks-ts";
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
        <Suspense fallback={<Loader />}>
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

const Loader = () => {
  const { progress } = useProgress();
  return (
    <>
      <Html center style={{ color: "white" }}>
        {progress} % loaded
      </Html>
    </>
  );
};

const SoundCloudPlayer = () => {
  return (
    <iframe
      title="soundcloud player"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/962285422&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
      style={{ display: "none" }}
    ></iframe>
  );
};
