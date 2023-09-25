import styles from "@/styles/GlobeScene.module.css";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEventListener, useToggle } from "usehooks-ts";
import { Feature, FeatureCollection } from "./GeoJsonTypes";

export const GlGlobe = () => {
  const ref = useRef<any>();
  const [i, setI] = useState<number>(0);

  const [countryData, setCountryData] = useState<FeatureCollection>();
  useEffect(() => {
    fetch("./countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountryData(data));
  }, [i]);

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [autoRotate, toggleAutoRotate] = useToggle(true);

  useEventListener("resize", () => {
    const camera = ref.current.camera() as THREE.PerspectiveCamera;
    const renderer = ref.current.renderer() as THREE.WebGLRenderer;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    setI(i + 1);
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
        polygonAltitude={() => 0.001}
        polygonLabel={(feature: Feature) =>
          `<b>${feature.properties.ADMIN} (${feature.properties.ISO_A2})</b> <br />
          Population: <i>${feature.properties.POP_EST}</i>`
        }
        onPolygonHover={(feature?: Feature, prevFeature?: Feature) => {
          if (feature !== prevFeature) {
            setSelectedFeature(feature);
          }
        }}
      />
      {selectedFeature && <DetailCard feature={selectedFeature} />}
      <GlobeControls autoRotateCallback={toggleAutoRotate} />
    </>
  );
};

const DetailCard = ({ feature }: { feature: Feature }) => {
  return (
    <Paper className={`${styles.detailCard}`}>
      <h1>Country details</h1>
      <h3>{feature.properties.ADMIN}</h3>
    </Paper>
  );
};

const GlobeControls = ({
  autoRotateCallback,
}: {
  autoRotateCallback: () => void;
}) => {
  return (
    <Stack className={`${styles.globeControls}`}>
      <Tooltip title="Toggle auto rotation">
        <IconButton onClick={() => autoRotateCallback()}>
          <AutoModeIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
