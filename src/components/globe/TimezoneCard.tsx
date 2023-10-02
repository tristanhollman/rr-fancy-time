import { useTimeZoneInfo } from "@/hooks/useTimeZoneInfo";
import styles from "@/styles/GlobeScene.module.css";
import { Paper } from "@mui/material";
import { DateTime } from "luxon";

export const TimezoneCard = ({ lat, lng }: { lat: number; lng: number }) => {
  const { timezoneData, timezoneError } = useTimeZoneInfo(lat, lng);

  return (
    <Paper className={`${styles.timezoneCard}`}>
      <h1>Timezone details</h1>
      <h3>Current time: {formattedTime(timezoneData?.time)}</h3>
      {timezoneError && (
        <p>
          Error retrieving the timezone information:
          <br />
          <span className={`${styles.error}`}>
            {timezoneError.status.message}
          </span>
        </p>
      )}
    </Paper>
  );
};

function formattedTime(value: string): string {
  if (!value) {
    return "";
  }
  const date = DateTime.fromFormat(value, "yyyy-MM-dd HH:mm");
  return date.toFormat("HH:mm");
}
