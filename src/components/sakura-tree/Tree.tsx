import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler, OBJLoader } from "three-stdlib";
import { primaryColor, treeColor } from "./constants";

type FlowerPointOptions = {
  points: THREE.Vector3[];
  angles: Float32Array;
  indexes: Float32Array;
};

export const Tree = (props: MeshProps) => {
  // Load the model.
  const objModel = useLoader(OBJLoader, "./tree.obj");
  // Get the geometry data from the loaded model.
  const geometry = useMemo(() => {
    let g;
    objModel.traverse((c) => {
      if (c.type === "Mesh") {
        const _c = c as THREE.Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [objModel]);

  // Define uniform values for the custom shaders.
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
    }),
    []
  );

  const flowerOptions = useMemo<FlowerPointOptions>(() => {
    const mesh = objModel.children[0] as THREE.Mesh;
    const sampler = new MeshSurfaceSampler(mesh)
      .setWeightAttribute(null)
      .build();

    const points: THREE.Vector3[] = [];
    const angles: number[] = [];
    const indexes: number[] = [];
    const n = new THREE.Vector3();
    for (let i = 0; i < 1250; i++) {
      const p = new THREE.Vector3();
      sampler.sample(p, n);
      points.push(p);
      angles.push((Math.random() * Math.PI * 2) / 5);
      indexes.push(i);
    }
    return {
      points: points,
      angles: new Float32Array(angles),
      indexes: new Float32Array(indexes),
    };
  }, [objModel]);

  const flowerPoints = useRef<THREE.Points>();
  const flowerGeom = useRef<THREE.BufferGeometry>();
  const flowerMat = useRef<THREE.PointsMaterial>();

  useLayoutEffect(() => {
    if (flowerGeom.current) {
      flowerGeom.current.setFromPoints(flowerOptions.points);
      flowerGeom.current.setAttribute(
        "angle",
        new THREE.BufferAttribute(new Float32Array(flowerOptions.angles), 1)
      );
      flowerGeom.current.setAttribute(
        "idx",
        new THREE.BufferAttribute(new Float32Array(flowerOptions.indexes), 1)
      );
    }
  }, [flowerOptions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.5;
    uniforms.u_time.value = t * 5;
  });

  return (
    <mesh {...props} geometry={geometry}>
      <meshBasicMaterial color={treeColor} wireframe={false} />

      {/* Flowers */}
      <points ref={flowerPoints}>
        <bufferGeometry ref={flowerGeom} attach="geometry" />
        <pointsMaterial
          ref={flowerMat}
          color={primaryColor}
          size={1}
          onBeforeCompile={(shader) => {
            shader.uniforms.u_time = uniforms.u_time;
            shader.fragmentShader = fragmentShader;
            shader.vertexShader = vertexShader;
          }}
        />
      </points>
    </mesh>
  );
};

/**
 * Vertex shader, used to control positioning, form and movement.
 */
const vertexShader = `
uniform float size;
uniform float scale;

uniform float u_time;

attribute float angle;
attribute float idx;

varying float vAngle;

#include <common>

// Calculate the base size of a petal based on how high it is on the tree.
// Resulting in almost no/small petals on the trunk, and bigger petals on the branches.
float calculateBaseSizeBasedOnHeight() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float yRatio = modelPosition.y / 10.;
  
  return size * yRatio;
}

void main() {
	#include <begin_vertex>
  
  vAngle = angle;

	#include <project_vertex>

  float petalSize = calculateBaseSizeBasedOnHeight();
	float halfPetalSize = petalSize * 0.5;

  float tIdx = idx + u_time;
  gl_PointSize = petalSize + (sin(tIdx) * cos(tIdx * 2.5) * 0.5 + 0.5) * halfPetalSize * 0.5;

	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
}
`;

/**
 * Fragment shader, used to control color and appearance.
 */
const fragmentShader = `
varying float vAngle;
uniform vec3 diffuse;
uniform float opacity;

#include <common>

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  float a = atan(uv.y, uv.x) + vAngle;
  float f = 0.4 + 0.1 * cos(a * 5.);
  f = 1. - step(f, length(uv));
  if (f < 0.5) discard;  // shape function

	vec3 outgoingLight = vec3( 0.0 );
	
  vec3 col = vec3(1, 1, 0.8);
  uv *= 2.;
  float d = clamp(length(uv), 0., 1.);
  vec4 diffuseColor = vec4(mix(col, diffuse, pow(d, 2.)), 1.);

	outgoingLight = diffuseColor.rgb;

	#include <opaque_fragment>
}
`;
