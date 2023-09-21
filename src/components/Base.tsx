import React, { useMemo } from "react";
import { backgroundColor, secondaryColor } from "./constants";
import { useControls } from "leva";
import { MeshProps } from "@react-three/fiber";

export const Base = (props: MeshProps) => {
  const options = useMemo(() => {
    return {
      radius: { value: 25, min: 0, max: 100, step: 0.5 },
      segments: { value: 32, min: 0, max: 100, step: 1 },
    };
  }, []);

  const baseOptions = useControls("Base Options", options);

  // Define uniform values for the background color
  const uniforms = useMemo(
    () => ({
      u_backgroundColor: { value: backgroundColor },
    }),
    []
  );

  return (
    <mesh {...props} rotation={[-Math.PI * 0.5, 0, 0]}>
      {/* Create a circle geometry */}
      <circleGeometry args={[baseOptions.radius, baseOptions.segments]} />
      {/* Apply a custom mesh basic material */}
      <meshBasicMaterial
        color={secondaryColor}
        defines={{ USE_UV: "" }}
        onBeforeCompile={(shader) => {
          // Use custom shaders instead of the defaults from the material.
          // Pass the background color uniform to the shader
          shader.uniforms.u_backgroundColor = uniforms.u_backgroundColor;
          // Set the vertex shader to the custom vertex shader
          shader.vertexShader = vertexShader;
          // Set the fragment shader to the custom fragment shader
          shader.fragmentShader = fragmentShader;
        }}
      />
    </mesh>
  );
};

/**
 * Vertex shader, used to control positioning, form and movement.
 */
const vertexShader = `
// Define a varying variable to pass UV coordinates to the fragment shader.
varying vec2 vUv;

void main() {
  // Assign the UV coordinates of the vertex to the varying variable.
  vUv = uv;

  // Calculate the final position of the vertex in camera space.
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Fragment shader, used to control color and appearance.
 */
const fragmentShader = `
// Uniforms for controlling material color and opacity.
uniform vec3 diffuse;  // The color of the material.
uniform float opacity; // The opacity of the material.

// Uniform for setting the background color.
uniform vec3 u_backgroundColor;

// Varying variable to receive UV coordinates from the vertex shader.
varying vec2 vUv;

void main() {
  // Primary color is the color of the base material.
  vec3 color1 = diffuse;

  // Secondary color is the background as set via the uniforms.
  vec3 color2 = u_backgroundColor;

  // Map UV coordinates to the range [-1, 1] to create a gradient.
  vec2 uv = vUv - 0.5;
  uv *= 2.0;

  // Interpolate between primary and secondary colors based on UV length.
  vec3 mixedColor = mix(color1, color2, length(uv));

  // Set the final fragment color with opacity.
  gl_FragColor = vec4(mixedColor, opacity);
}
`;
