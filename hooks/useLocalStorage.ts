import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialState: T
): [T, (state: T) => void] {
  const [state, setState] = useState<T>(initialState);

  const setLocalStorage = useCallback(
    (newState: T) => {
      window?.localStorage.setItem(key, JSON.stringify(newState));
      setState(newState);
    },
    [key]
  );

  const useIsoLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    const localStorageState: T = JSON.parse(
      window.localStorage.getItem(key) ?? JSON.stringify(initialState)
    );
    setState(localStorageState);
  }, [key, initialState]);

  return [state, setLocalStorage];
}
