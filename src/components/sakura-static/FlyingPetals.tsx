import useKeyboard from "@/hooks/useKeyboard";
import { useTime } from "@/hooks/useTime";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type PointOptions = {
  points: THREE.Vector3[];
  delay: Float32Array;
  speed: Float32Array;
  color: Float32Array;
};

export const FlyingPetals = () => {
  const keyMap = useKeyboard();
  const time = useTime();

  const options = useMemo(() => {
    return {
      maxPoints: { value: 40000, min: 0, max: 100000, step: 1 },
      radius: { value: 8, min: 1, max: 10, step: 1 },
      color: "#ffb2e5", //`#dfb1b6`,
      speed: { value: 0.5, min: 0, max: 25, step: 0.1 },
    };
  }, []);

  const petalOptions = useControls("Petal Options", options);

  const pointOptions = useMemo<PointOptions>(() => {
    const radius = petalOptions.radius;
    const maxPoints = petalOptions.maxPoints;

    const points: THREE.Vector3[] = []; //3
    const delay: number[] = []; //1
    const speed: number[] = []; //2
    const color: number[] = []; //3
    const c = new THREE.Color();

    let pointsCount = 0;
    while (pointsCount < maxPoints) {
      const vec = new THREE.Vector3(
        THREE.MathUtils.randFloat(-radius, radius),
        0,
        THREE.MathUtils.randFloat(-radius, radius)
      );
      const distanceFromCenter = vec.length();
      const rRatio = distanceFromCenter / radius;
      // Only draw points that are within the circle radius.
      // And slightly increase the chance for points to be drawn near the center of the circle.
      if (distanceFromCenter <= radius && Math.random() < 1.5 - rRatio) {
        points.push(vec);
        c.set(petalOptions.color);
        color.push(
          c.r + THREE.MathUtils.randFloat(-0.15, 0.15),
          c.g + THREE.MathUtils.randFloat(-0.15, 0.15),
          c.b + THREE.MathUtils.randFloat(-0.15, 0.15)
        );
        delay.push(THREE.MathUtils.randFloat(-10, 0));
        let val = THREE.MathUtils.randFloat(1, 2);
        val = Math.random() < 0.25 ? 0 : val;
        speed.push(Math.PI * val * 0.125, val); // angle, height
        pointsCount++;
      }
    }

    return {
      points: points,
      delay: new Float32Array(delay),
      speed: new Float32Array(speed),
      color: new Float32Array(color),
    };
  }, [petalOptions]);

  const effectCanvas = useMemo<THREE.CanvasTexture>(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f00";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 56px Arial";
    var timeString = time.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    });
    context.save();
    context.scale(1, -1);
    context.fillText(
      timeString,
      canvas.width * 0.5,
      canvas.height * 0.5 * -1, // times -1 because the y-axis is flipped.
      canvas.width * 0.9
    );
    context.restore();

    return new THREE.CanvasTexture(canvas);
  }, [time]);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      upperLimit: { value: 20 },
      upperRatio: { value: 1.25 },
      spiralRadius: { value: 1 },
      spiralTurns: { value: 0 },
      effectCanvas: { value: effectCanvas },
      azimuth: { value: 0 },
    }),
    // We can't use the dependency as that will create a new instance, which will break the shader.
    // Instead values are updated in the useFrame hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { controls } = useThree();
  const geom = useRef<THREE.BufferGeometry>();
  const mat = useRef<THREE.PointsMaterial>();
  const ref = useRef<THREE.Points>();

  useLayoutEffect(() => {
    if (geom.current) {
      geom.current.setFromPoints(pointOptions.points);
      geom.current.setAttribute(
        "color",
        new THREE.BufferAttribute(pointOptions.color, 3)
      );
      geom.current.setAttribute(
        "delay",
        new THREE.BufferAttribute(pointOptions.delay, 1)
      );
      geom.current.setAttribute(
        "speed",
        new THREE.BufferAttribute(pointOptions.speed, 2)
      );
    }
  }, [pointOptions]);

  useFrame((state) => {
    const isHyped = keyMap["Space"];
    const speed = isHyped ? 25 : petalOptions.speed;
    const t = state.clock.getElapsedTime() * speed;
    uniforms.time.value = t;
    if (controls) {
      uniforms.azimuth.value = (controls as any).getAzimuthalAngle() * -1;
    }
    uniforms.effectCanvas.value = effectCanvas;
  });

  return (
    <points ref={ref} position={[0, 14, 0]} rotation={[-Math.PI * 1, 0, 0]}>
      <bufferGeometry ref={geom} attach="geometry" />
      <pointsMaterial
        ref={mat}
        vertexColors={true}
        size={0.2}
        onBeforeCompile={(shader) => {
          // Assign uniform values
          shader.uniforms.time = uniforms.time;
          shader.uniforms.upperLimit = uniforms.upperLimit;
          shader.uniforms.upperRatio = uniforms.upperRatio;
          shader.uniforms.spiralRadius = uniforms.spiralRadius;
          shader.uniforms.spiralTurns = uniforms.spiralTurns;
          shader.uniforms.effectCanvas = uniforms.effectCanvas;
          shader.uniforms.azimuth = uniforms.azimuth;
          // Asign vertex and fragment shaders.
          shader.vertexShader = vertexShader;
          shader.fragmentShader = fragmentShader;
        }}
      />
    </points>
  );
};

/**
 * Vertex shader, used to control positioning, form and movement.
 */
const vertexShader = `
uniform float time;
uniform float upperLimit;
uniform float upperRatio;
uniform float spiralRadius;
uniform float spiralTurns;
uniform sampler2D effectCanvas;
uniform float azimuth;

attribute float delay;
attribute vec2 speed;

varying float vRatio;
varying vec2 vSpeed;
varying float vIsEffect;
varying float vIsInFrontOfEffect;

mat2 rot( float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>

void main() {
	#include <color_vertex>
	#include <begin_vertex>

  float t = time + delay;
  t = t < 0. ? 0. : t;
  
  float h = mod(speed.y * t, upperLimit);
  float hRatio = clamp(h / upperLimit, 0., 1.);
  vRatio = hRatio;
  vSpeed = speed;
  
  transformed.y = h;
  
  float a = atan(position.x, position.z);
  a += speed.x * t;
  float initLength = length(position.xz);
  float finalLength = initLength * upperRatio;
  float ratio = mix(initLength, finalLength, hRatio);
  transformed.x = cos(a) * ratio;
  transformed.z = sin(a) * -ratio;
  
  float sTurns = sin(time * 0.5) * 0.5 + spiralTurns;

  float spiralA = hRatio * sTurns * PI * 2.;
  float sRadius = mix(spiralRadius, 0., hRatio);
  transformed.x += cos(spiralA) * sRadius;
  transformed.z += sin(spiralA) * -sRadius;

  // Text canvas effect
  vec3 effectPosition = vec3(0, 14, 1.); // The center position of the text canvas.
  vec3 effectClamp = vec3(1.5, 1., 0.25) * 3.5; // The range of the canvas
  vec3 effectMin = effectPosition - effectClamp;
  vec3 effectMax = effectPosition + effectClamp;
  vec3 UVTransformed = vec3(transformed);
  UVTransformed.xz *= rot(azimuth); // following the camera's azimuthal angle
  vec3 effectUV = (UVTransformed - effectMin) / (effectMax - effectMin);
  
  float isEffect = texture2D(effectCanvas, effectUV.xy).r;
  isEffect *= (effectUV.z > 0. && effectUV.z < 1.) ? 1. : 0.;
  vIsEffect = isEffect;

  // In front of text canvas effect
  float isInFrontOfEffect = texture2D(effectCanvas, effectUV.xy).r;
  isInFrontOfEffect *= effectUV.z <= 0. ? 1. : 0.; // 1. if in front, 0 if not.
  vIsInFrontOfEffect = isInFrontOfEffect;

	#include <morphtarget_vertex>
	#include <project_vertex>

	bool cond = floor(speed.y + 0.5) == 0.;
  gl_PointSize = size * ( cond ? 0.75 : ((1. - hRatio) * (smoothstep(0., 0.01, hRatio) * 0.25) + 0.75));
  // Make petals in the text effect area twice as large.
  gl_PointSize = mix(gl_PointSize, size * 2., isEffect);
    
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
}`;

/**
 * Fragment shader, used to control color and appearance.
 */
const fragmentShader = `
uniform float time;

varying float vRatio;
varying vec2 vSpeed;
varying float vIsEffect;
varying float vIsInFrontOfEffect;

mat2 rot( float a){
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <color_pars_fragment>

void main() {
  if (vRatio == 1.) discard;

  vec2 uv = gl_PointCoord - 0.5;

  float a = (time * vSpeed.x + vSpeed.x) * 10.;
  
  uv *= rot(a);
  uv.y *= floor(a + 0.5) == 0. ? 1.25 : 2. + sin(a * PI);

  if (length(uv) > 0.5) discard;  // shape function
  if (vIsInFrontOfEffect > 0.) discard;  // Hide petals that are in front of the text effect canvas

  #include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	
  vec3 mainCol = vec3(1, 0.7, 0.9);
  vec3 effectCol = vec3(0.95, 0, 0.45);
  float d = clamp(uv.x + .5, 0., 1.);
  vec4 diffuseColor = vec4(mix(diffuse, mainCol, pow(d, 2.)), 1.);
  diffuseColor = vec4(mix(diffuseColor.rgb, effectCol, vIsEffect), 1.);

	#include <color_fragment>

	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}`;
