import React from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();

  React.useEffect(() => {
    if (Array.isArray(dependencies) && dependencies.length && dependencies[0]) {
      renderChartFn(ref);
    }

    return () => {};
  }, dependencies);
  return ref;
};
