import { useFetch } from "usehooks-ts";

// Too lazy to figure something else out...so just use a basic free api to get this data :/
const username = "tristanh";

export function useTimeZoneInfo(lat: number, lng: number) {
  const roundedLat = lat.toFixed(2);
  const roundedLng = lng.toFixed(2);

  const url = `https://secure.geonames.org/timezoneJSON?lat=${roundedLat}&lng=${roundedLng}&username=${username}`;
  const { data } = useFetch<TimeZoneApiResponse | TimeZoneApiErrorResponse>(
    url
  );

  if (!data) {
    return { timezoneData: null };
  }

  // Manually check the result, as it will always return a 200 OK :(
  if ("status" in data) {
    return { timezoneError: data as TimeZoneApiErrorResponse };
  }

  return { timezoneData: data as TimeZoneApiResponse };
}

export type TimeZoneApiResponse = {
  sunrise: string;
  lng: number;
  countryCode: string;
  gmtOffset: number;
  rawOffset: number;
  sunset: string;
  timezoneId: string;
  dstOffset: number;
  countryName: string;
  time: string;
  lat: number;
};

export type TimeZoneApiErrorResponse = {
  status: {
    message: string;
  };
};
