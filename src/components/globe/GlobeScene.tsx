import styles from "@/styles/Scene.module.css";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useLocalStorage } from "usehooks-ts";
import { CanvasLoader } from "../shared/CanvasLoader";
import { SoundCloudPlayer } from "../shared/SoundCloudPlayer";
import { Globe } from "./Globe";

export default function GlobeScene() {
  const [isDevMode] = useLocalStorage("devMode", false);

  const scene = new THREE.Scene();

  return (
    <>
      <Canvas
        scene={scene}
        shadows
        camera={{ position: [0, 150, 250] }}
        className={`${styles.backgroundCanvas}`}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Background />
          <RotatingCamera />
          <Globe position={[0, 0, 0]} />
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
      autoRotate: true,
      autoRotateSpeed: { value: -0.5, min: -100, max: 100, step: 0.5 },
      minDistance: 125,
      maxDistance: 1000,
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
      minDistance={cameraOptions.minDistance}
      maxDistance={cameraOptions.maxDistance}
      target={[0, 0, 0]}
      makeDefault={true}
    />
  );
};

const Background = () => {
  const texture = useLoader(THREE.TextureLoader, "./space.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  const { scene } = useThree();
  scene.background = texture;

  return (
    <>
      <ambientLight color="white" intensity={1} />
    </>
  );
};
