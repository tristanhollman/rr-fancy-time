import styles from "@/styles/Scene.module.css";
import { Html, OrbitControls, Stats, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Base } from "./Base";
import { FlyingPetals } from "./FlyingPetals";
import { Tree } from "./Tree";
import { backgroundColor } from "./constants";
import { useLocalStorage } from "usehooks-ts";

export default function SakuraScene() {
  const [isDevMode] = useLocalStorage("devMode", false);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 4, 12] }}
        className={`${styles.backgroundCanvas}`}
      >
        <Background />
        <RotatingCamera />
        <Suspense fallback={<Loader />}>
          <Base position={[-8, -0.15, 4]} />
          <Tree
            rotation={[0, THREE.MathUtils.DEG2RAD * 80, 0]}
            position={[-8, 0, 4]}
            scale={16}
          />
          <FlyingPetals />
        </Suspense>
        {isDevMode && <Stats />}
      </Canvas>
      <Leva hidden={!isDevMode} collapsed />
      <SoundCloudPlayer />
    </>
  );
}

const RotatingCamera = () => {
  const options = useMemo(() => {
    return {
      autoRotate: false,
      autoRotateSpeed: { value: -0.5, min: -100, max: 100, step: 0.5 },
    };
  }, []);

  const cameraOptions = useControls("Rotating Camera Options", options);

  return (
    <OrbitControls
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.05}
      autoRotate={cameraOptions.autoRotate}
      autoRotateSpeed={cameraOptions.autoRotateSpeed}
      minPolarAngle={THREE.MathUtils.DEG2RAD * 70}
      maxPolarAngle={THREE.MathUtils.DEG2RAD * 80}
      minDistance={9}
      maxDistance={12}
      target={[0, 3, 0]}
      makeDefault={true}
    />
  );
};

const Background = () => {
  const { gl } = useThree();
  gl.setClearColor(backgroundColor);

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
    <Html center style={{ color: "white" }}>
      {progress} % loaded
    </Html>
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
