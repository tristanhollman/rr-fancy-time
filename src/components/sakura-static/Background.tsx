import { useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import * as THREE from "three";

export const Background = () => {
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
