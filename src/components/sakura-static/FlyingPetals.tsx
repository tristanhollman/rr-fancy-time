import useKeyboard from "@/hooks/useKeyboard";
import { useTime } from "@/hooks/useTime";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { glsl } from "../shared/GlslTyping";

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
      maxPoints: { value: 50000, min: 0, max: 100000, step: 1 },
      radius: { value: 10, min: 1, max: 15, step: 1 },
      color: "#ffb2e5",
      speed: { value: 0.5, min: 0, max: 25, step: 0.1 },
    };
  }, []);

  const petalOptions = useControls("Petal Options", options);

  const pointOptions = useMemo<PointOptions>(() => {
    const xRadius = petalOptions.radius;
    const zRadius = petalOptions.radius; // * 0.5; // => For when making an ellipse.
    const maxPoints = petalOptions.maxPoints;

    const points: THREE.Vector3[] = []; //3
    const delay: number[] = []; //1
    const speed: number[] = []; //2
    const color: number[] = []; //3
    const c = new THREE.Color();

    let pointsCount = 0;
    while (pointsCount < maxPoints) {
      // Using rejection sampling, generate random coordinates within the bounding box.
      const x = THREE.MathUtils.randFloat(-xRadius, xRadius);
      const z = THREE.MathUtils.randFloat(-zRadius, zRadius);
      // And then reject/ignore all points that fall outside of the radius.
      if (isPointInEllipseRadius(x, z, xRadius, zRadius)) {
        points.push(new THREE.Vector3(x, 0, z));
        c.set(petalOptions.color);
        // Slightly randomize the color of each petal.
        color.push(
          c.r + THREE.MathUtils.randFloat(-0.15, 0.15),
          c.g + THREE.MathUtils.randFloat(-0.15, 0.15),
          c.b + THREE.MathUtils.randFloat(-0.15, 0.15)
        );
        delay.push(THREE.MathUtils.randFloat(-15, 0));
        let val = THREE.MathUtils.randFloat(1, 2);
        val = Math.random() < 0.25 ? 0 : val;
        // Speed is determined by angle and height.
        speed.push(Math.PI * val * 0.125, val);
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
      upperRatio: { value: 1 },
      effectCanvas: { value: effectCanvas },
      azimuth: { value: 0 },
      isEllipseShape: { value: false }, // Defaults to false for now.
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
          shader.uniforms.u_time = uniforms.time;
          shader.uniforms.u_upperLimit = uniforms.upperLimit;
          shader.uniforms.u_upperRatio = uniforms.upperRatio;
          shader.uniforms.u_effectCanvas = uniforms.effectCanvas;
          shader.uniforms.u_azimuth = uniforms.azimuth;
          shader.uniforms.u_isEllipseShape = uniforms.isEllipseShape;
          // Asign vertex and fragment shaders.
          shader.vertexShader = vertexShader;
          shader.fragmentShader = fragmentShader;
        }}
      />
    </points>
  );
};

/**
 * Calculates if the provided point is in the provided ellipse boundary.
 * Done using the equation for an ellipse: (x^2 / xRadius^2) + (z^2 / zRadius^2) <= 1
 * @param x The x coordinate of the point to check.
 * @param z The z coordinate of the point to check.
 * @param xRadius The x radius of the ellipse.
 * @param zRadius The z radius of the ellipse.
 */
const isPointInEllipseRadius = (
  x: number,
  z: number,
  xRadius: number,
  zRadius: number
): boolean => {
  // Check if the point is within the ellipse, using the equation for an ellipse: (x^2 / xRadius^2) + (z^2 / zRadius^2) <= 1
  const xRatio = x ** 2 / xRadius ** 2;
  const zRatio = z ** 2 / zRadius ** 2;
  return xRatio + zRatio <= 1;
};

/**
 * Vertex shader, used to control positioning, form and movement.
 */
const vertexShader = glsl`
// Uniforms for controlling animation and appearance.
uniform float u_time;
uniform float u_upperLimit;
uniform float u_upperRatio;
uniform sampler2D u_effectCanvas; // Texture for text canvas effect.
uniform float u_azimuth;
uniform bool u_isEllipseShape; // False = Circle, True = ellipse

// Attributes for each petal.
attribute float delay;
attribute vec2 speed;

// Varying variables passed to the fragment shader.
varying float v_ratio; // Ratio of current height to upper limit.
varying vec2 v_speed; // Speed of the petal.
varying float v_isEffect; // Indicates if the petal is inside the text canvas effect.
varying float v_isNearEffect; // Indicates if the petal is in front of the text canvas effect.

// Uniforms for controlling petal size and scale.
uniform float size;
uniform float scale;

// Include common and color vertex shader components.
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>

// Function to rotate a 2D vector.
mat2 rot( float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
	// Include color calculations and vertex setup.
	#include <color_vertex>
	#include <begin_vertex>

  // Calculate the time for the petal animation.
  float t = u_time + delay;
  t = t < 0. ? 0. : t;
  
  // Calculate the current height and its ratio.
  float h = mod(speed.y * t, u_upperLimit);
  float hRatio = clamp(h / u_upperLimit, 0., 1.);
  v_ratio = hRatio;
  v_speed = speed;
  
  // Set the petal's new height.
  transformed.y = h;
  
  // Calculate the angle based on the current position.
  // Documentation reference: https://thebookofshaders.com/glossary/?search=atan
  // atan() returns the angle whose trigonometric arctangent is y,x. The signs of y and x are used to determine the quadrant that the angle lies in.
  // The values returned by atan in this case are in the range -PI and PI. Results are undefined if x is zero.
  float angle = atan(position.x, position.z);
  angle += speed.x * t;
  float initLength = length(position.xz);
  float finalLength = initLength * u_upperRatio;
  float ratio = mix(initLength, finalLength, hRatio);

  // Calculate transformed positions with modified angle
  if (u_isEllipseShape) {
    transformed.x = cos(angle) * ratio * 2.;
    transformed.z = sin(angle) * -ratio * 0.5; // Keep in mind we want the rotation to also stick to the ellipse.
  } else {
    transformed.x = cos(angle) * ratio;
    transformed.z = sin(angle) * -ratio;
  }

  // Text canvas effect calculations
  vec3 effectPosition = vec3(0, 14, 2.); // The center position of the text canvas.
  vec3 effectClamp = vec3(1.5, 1., 0.25) * 3.5; // The range of the canvas.
  vec3 effectMin = effectPosition - effectClamp;
  vec3 effectMax = effectPosition + effectClamp;
  vec3 UVTransformed = vec3(transformed);
  UVTransformed.xz *= rot(u_azimuth); // Follow the camera's azimuthal angle
  vec3 effectUV = (UVTransformed - effectMin) / (effectMax - effectMin);
  
  // Check if the petal is inside the text canvas effect.
  float isEffect = texture2D(u_effectCanvas, effectUV.xy).r;
  isEffect *= (effectUV.z > 0. && effectUV.z < 1.) ? 1. : 0.;
  v_isEffect = isEffect;

  // Check if the petal is near the text canvas effect.
  vec3 nearEffectPosition = effectPosition; // Take the center position of the main canvas.
  vec3 nearEffectClamp = effectClamp * vec3(1.5, 1., 3.); // Increase the range of the x and z axis to hide petals that might blur the 'in effect' petals.
  vec3 nearEffectMin = nearEffectPosition - nearEffectClamp;
  vec3 nearEffectMax = nearEffectPosition + nearEffectClamp;
  vec3 nearUVTransformed = vec3(transformed);
  nearUVTransformed.xz *= rot(u_azimuth); // Follow the camera's azimuthal angle
  vec3 nearEffectUV = (nearUVTransformed - nearEffectMin) / (nearEffectMax - nearEffectMin);

  // We don't need to use the 'u_effectCanvas' itself here, as we don't care about the exact text,
  // everything that overlaps with the boundary is considered to be near the canvas.
  // That means we do need to check whether the petal is near on all axis.
  float isNearEffect = (
    nearEffectUV.z > 0. && nearEffectUV.z < 1.
    && nearEffectUV.y > 0. && nearEffectUV.y < 1.
    && nearEffectUV.x > 0. && nearEffectUV.x < 1.
    ) ? 1. : 0.;
  v_isNearEffect = isNearEffect;

	// Include morph target and project vertex components.
	#include <morphtarget_vertex>
	#include <project_vertex>

	// Adjust petal size based on height and text canvas effect.
	bool cond = floor(speed.y + 0.5) == 0.;
  gl_PointSize = size * ( cond ? 0.75 : ((1. - hRatio) * (smoothstep(0., 0.01, hRatio) * 0.25) + 0.75));

  if (isEffect == 1.) {
    // Make petals in the text effect area larger.
    gl_PointSize = size * 2.5;
  } else if (isNearEffect == 1.) {
    // And the petals that are near the effect area smaller.
    gl_PointSize = size * 0.5;
  }
    
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
}`;

/**
 * Fragment shader, used to control color and appearance.
 */
const fragmentShader = glsl`
uniform float u_time; // Time uniform

varying float v_ratio; // Ratio of current height to upper limit
varying vec2 v_speed; // Speed of the petal
varying float v_isEffect; // Indicates if the petal is inside the text canvas effect
varying float v_isNearEffect; // Indicates if the petal is close to the canvas effect

// Uniforms for controlling color and opacity
uniform vec3 diffuse; // Primary color of the petal
uniform float opacity;

// Include common and color fragment shader components
#include <common>
#include <color_pars_fragment>

// Function to rotate a 2D vector
mat2 rot(float a){
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  // Discard the petal if it has reached the maximum height.
  if (v_ratio == 1.) discard;

  // Calculate UV coordinates centered at the petal.
  vec2 uv = gl_PointCoord - 0.5;

  // Calculate the angle of rotation for the petal based on time and speed.
  float a = (u_time * v_speed.x + v_speed.x) * 10.;
  
  // Apply rotation to UV coordinates.
  uv *= rot(a);
  // Apply vertical scaling to create petal shape.
  uv.y *= floor(a + 0.5) == 0. ? 1.25 : 2. + sin(a * PI);

  // Discard fragments outside the petal shape
  if (length(uv) > 0.5) discard;
  // Discard fragments that are near the canvas effect (but obviously not the petals that are inside the effect range).
  // if (v_isEffect < 1. && v_isNearEffect > 0.) discard;

  // Include clipping planes calculations for advanced rendering techniques
  #include <clipping_planes_fragment>
	
  // Apply color to the petal
	vec3 outgoingLight = vec3( 0.0 ); // Initialize the outgoing light color
  vec3 mainCol = vec3(1, 0.7, 0.9);
  vec3 effectCol = vec3(0.95, 0, 0.45);
  float d = clamp(uv.x + .5, 0., 1.);
  vec4 diffuseColor = vec4(mix(diffuse, mainCol, pow(d, 2.)), 1.);
  diffuseColor = vec4(mix(diffuseColor.rgb, effectCol, v_isEffect), 1.);

  // Include color calculation component
	#include <color_fragment>

  // Set outgoing light and final fragment color
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}`;
