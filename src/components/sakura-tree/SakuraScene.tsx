import { useDevMode } from "@/hooks/useDevMode";
import styles from "@/styles/SakuraScene.module.css";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { CanvasLoader } from "../shared/CanvasLoader";
import { SoundCloudPlayer } from "../shared/SoundCloudPlayer";
import { Base } from "./Base";
import { FlyingPetals } from "./FlyingPetals";
import { Tree } from "./Tree";
import { backgroundColor } from "./constants";

export default function SakuraScene() {
  const [isDevMode] = useDevMode();

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 4, 12] }}
        className={`${styles.backgroundCanvas}`}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Background />
          <RotatingCamera />
          <Base position={[-8, -0.15, 4]} />
          <Tree
            rotation={[0, THREE.MathUtils.DEG2RAD * 80, 0]}
            position={[-8, 0, 4]}
            scale={16}
          />
          <FlyingPetals />
          {isDevMode && <Stats />}
        </Suspense>
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
