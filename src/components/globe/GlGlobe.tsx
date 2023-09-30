import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEventListener, useToggle } from "usehooks-ts";
import { DetailCard } from "./DetailCard";
import { CountryFeature, CountryFeatureCollection } from "./GeoJsonTypes";
import { GlobeControls } from "./GlobeControls";
import { TimezoneCard } from "./TimezoneCard";

export const GlGlobe = () => {
  const ref = useRef<any>();

  const [countryData, setCountryData] = useState<CountryFeatureCollection>();
  useEffect(() => {
    fetch("./countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountryData(data));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(
    null
  );
  const [selectedCoords, setSelectedCoords] = useState<Coords | null>(null);
  const [autoRotate, toggleAutoRotate] = useToggle(true);

  useEventListener("resize", () => {
    // Also make sure the camera/renderer are using the new screen sizes and view port.
    const camera = ref.current.camera() as THREE.PerspectiveCamera;
    const renderer = ref.current.renderer() as THREE.WebGLRenderer;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    const controls = ref.current.controls() as OrbitControls;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = -0.5;
  }, [autoRotate]);

  return (
    <>
      <Globe
        ref={ref}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        polygonsData={countryData?.features ?? []}
        polygonCapColor={() => "transparent"}
        polygonStrokeColor={() => "rgba(15, 15, 15, 0.8)"}
        polygonSideColor={() => "rgba(15, 15, 15, 0.8)"}
        polygonAltitude={() => 0.002}
        polygonLabel={(country: CountryFeature) =>
          `<b>${country.properties.ADMIN}</b>`
        }
        onPolygonClick={(
          country: CountryFeature,
          _: MouseEvent,
          coords: { lat: number; lng: number; altitude: number }
        ) => {
          setSelectedCountry(country);
          setSelectedCoords(coords);
        }}
      />
      <DetailCard country={selectedCountry} />
      {selectedCoords && (
        <TimezoneCard lat={selectedCoords.lat} lng={selectedCoords.lng} />
      )}
      <GlobeControls autoRotateCallback={toggleAutoRotate} />
    </>
  );
};

type Coords = {
  lat: number;
  lng: number;
};
