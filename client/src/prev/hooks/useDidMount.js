import { useEffect, useRef } from "react";

export default function useDidMount(callback) {
  const didMount = useRef(null);
  const cleanUp = useRef(undefined);

  useEffect(() => {
    if (callback && !didMount.current) {
      didMount.current = true;
      cleanUp.current = callback();
    }

  });

  useEffect(() => {
    return cleanUp.current;
  }, [])

}