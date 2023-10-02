import styles from "@/styles/GlobeScene.module.css";
import { Paper } from "@mui/material";
import { CountryFeature } from "./GeoJsonTypes";

export const DetailCard = ({ country }: { country?: CountryFeature }) => {
  if (country) {
    return (
      <Paper className={`${styles.detailCard}`}>
        <h1>Country details</h1>
        <h3>{country.properties.ADMIN}</h3>
      </Paper>
    );
  }
};
