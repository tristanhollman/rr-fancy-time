import { ReactThreeFiber, extend } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ThreeGlobe from "three-globe";

extend({ ThreeGlobe });

// Add types to JSX namespace so typescript is happy too :)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      threeGlobe: ReactThreeFiber.Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
    }
  }
}

type DataElement = {
  lat: number;
  lng: number;
  size: number;
  color: string;
};

export const Globe = (props) => {
  // This reference will give us direct access to the ThreeGlobe class
  const globeRef = useRef<ThreeGlobe>();

  const options = useMemo(() => {
    return {
      overlay: { value: "None", options: ["Labels", "Countries", "TimeZones"] },
    };
  }, []);

  const globeOptions = useControls("Globe Options", options);

  const [countryData, setCountryData] = useState<any>();
  useEffect(() => {
    fetch("./countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountryData(data));
  }, []);
  const [timeZoneData, setTimeZoneData] = useState<any>();
  useEffect(() => {
    fetch("./worldTimeZoneAreasLow.json")
      .then((res) => res.json())
      .then((data) => setTimeZoneData(data));
  }, []);

  // An effect that runs after three.js elements are created but before render
  useLayoutEffect(() => {
    // Configure the globe
    globeRef.current.globeImageUrl(
      "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    );
    globeRef.current.bumpImageUrl(
      "//unpkg.com/three-globe/example/img/earth-topology.png"
    );

    const N = 50;
    const gData: DataElement[] = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() * 1,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }));

    globeRef.current
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

    // Clear all layers
    globeRef.current.labelsData([]);
    globeRef.current.polygonsData([]);

    switch (globeOptions.overlay) {
      case "Labels": {
        globeRef.current
          .labelsData(gData)
          .labelText(
            (d: DataElement) =>
              `(${Math.round(d.lat * 1e2) / 1e2}, ${
                Math.round(d.lng * 1e2) / 1e2
              })`
          )
          .labelSize("size")
          .labelDotRadius((d: DataElement) => d.size / 5)
          .labelColor("color");
        break;
      }
      case "Countries": {
        globeRef.current
          .polygonsData(countryData?.features ?? [])
          .polygonCapColor(() => getRandomColor())
          .polygonSideColor(() => "rgba(0, 200, 0, 0.1)")
          .polygonStrokeColor(() => "#111");
        break;
      }
      case "TimeZones": {
        globeRef.current
          .polygonsData(timeZoneData?.features ?? [])
          .polygonCapColor(() => getRandomColor())
          .polygonSideColor(() => "rgba(0, 200, 0, 0.1)")
          .polygonStrokeColor(() => "#111");
        break;
      }
    }
  }, [countryData, timeZoneData, globeOptions]);

  // This is a ThreeGlobe object but represented in JSX.
  // Any valid properties of that class are valid props
  return <threeGlobe {...props} ref={globeRef} />;
};

function getRandomColor() {
  return `#${Math.round(Math.random() * Math.pow(2, 24))
    .toString(16)
    .padStart(6, "0")}`;
}
