import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

const props = [
  "offsetTop",
  "offsetLeft",
  "offsetWidth",
  "offsetHeight",
] as const;

type Prop = typeof props[number];

type Dimension = { [prop in Prop]?: number };

type State = { [prop in Prop]?: boolean };

export default function useResize(
  element: React.RefObject<any> | null,
  callback: (state: State) => void,
  deps?: any[]
) {
  const prevDimension = useRef<Dimension>({});
  const prevDeps = useRef<any[]>();
  const prevOnResize = useRef<() => void>();

  const getDiemnsion = useCallback(() => {
    if (!window || !element) return prevDimension.current;
    return props.reduce<Dimension>((dim, prop) => {
      dim[prop] = element.current[prop];
      return dim;
    }, {});
  }, [element]);

  const onResize = useCallback(() => {
    const dimension = getDiemnsion();
    const [state, isResized] = props.reduce<[State, boolean]>(
      ([state, isResized], prop) => {
        state[prop] = dimension[prop] !== prevDimension.current[prop];
        return [state, isResized || state[prop] || false];
      },
      [{}, false]
    );
    if (isResized) {
      callback(state);
      prevDimension.current = dimension;
    }
  }, [callback, getDiemnsion]);

  const onDebouncedResize = useMemo(() => debounce(onResize, 100), [onResize]);

  useEffect(() => {
    if (!window) return;
    window.addEventListener("resize", onDebouncedResize);
    if (prevOnResize.current) {
      window.removeEventListener("resize", prevOnResize.current);
    }
    prevOnResize.current = onDebouncedResize;
    return () => window.removeEventListener("resize", onDebouncedResize);
  }, [onDebouncedResize]);

  useEffect(() => {
    if (!deps) {
      onDebouncedResize();
    } else {
      const isChanged =
        !prevDeps.current ||
        deps.reduce((isChanged, dep, i) => {
          return isChanged || dep !== prevDeps.current?.[i];
        }, false);
      if (isChanged) {
        onDebouncedResize();
        prevDeps.current = [...deps];
      }
    }
  });
}
