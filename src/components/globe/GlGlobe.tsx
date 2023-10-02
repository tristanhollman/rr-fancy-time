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
  const [markers, setMarkers] = useState<Coords[]>([]);
  const [autoRotate, toggleAutoRotate] = useToggle(true);

  useEventListener("resize", () => {
    // Also make sure the camera/renderer are using the new screen sizes and view port.
    const camera = ref.current.camera() as THREE.PerspectiveCamera;
    const renderer = ref.current.renderer() as THREE.WebGLRenderer;

    // clear the selected values, as on-globe-positioning is probably messed up after resizing.
    unselect();

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    const controls = ref.current.controls() as OrbitControls;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = -0.5;
  }, [autoRotate]);

  const select = (country: CountryFeature, coords: Coords) => {
    setSelectedCountry(country);
    setSelectedCoords(coords);
    setMarkers([coords]);
  };

  const unselect = () => {
    setSelectedCountry(null);
    setSelectedCoords(null);
    setMarkers([]);
  };

  const createCustomBox = (coords: Coords) => {
    // Create a custom box that looks similar to the <Paper> component from material ui.
    const el = document.createElement("div");
    el.innerHTML = `<h1>Timezone details</h1>`;
    el.style.color = "#ffffff";
    el.style.width = "fit-content";
    el.style.height = "fit-content";
    el.style.padding = "1rem";
    el.style.backgroundColor = "#121212";
    el.style.borderRadius = "4px";
    el.style.transition = "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms";
    el.style.boxShadow =
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)";
    el.style.backgroundImage =
      "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))";
    return el;
  };

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
        ) => select(country, coords)}
        // htmlElementsData={markers}
        // htmlAltitude={0.01}
        // htmlElement={(data: Coords) => createCustomBox(data)}
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
