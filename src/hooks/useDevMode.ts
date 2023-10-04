import { useLocalStorage } from "usehooks-ts";

export function useDevMode(): [boolean, (value: boolean) => void] {
  const [isDevMode, setDevMode] = useLocalStorage<boolean>("devMode", false);

  return [isDevMode, setDevMode];
}
