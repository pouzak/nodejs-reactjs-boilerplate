import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstanceCreator } from "../redux/misc";
import usePrevious from "./usePrevious";

export const useFetch = (meth, url, body, input, opt) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [serverError, setServerError] = useState(null);
  const state = useSelector((state) => state.data);

  const prevInput = usePrevious(input);
  const prevUrl = usePrevious(url);

  useEffect(() => {
    if (
      (input && JSON.parse(prevInput) !== JSON.parse(input)) ||
      url !== prevUrl
    ) {
      if (!url) return;

      setIsLoading(true);
      setServerError(null);
      setApiData(null);
      const fetchData = async () => {
        try {
          let dcu;
          if (opt && opt.dcu) {
            dcu = { id: opt.dcu };
          } else {
            dcu = state.dcu;
          }

          const resp = await axiosInstanceCreator(dcu, meth, url, body);
          const data = await resp?.data;
          setApiData(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setServerError(error.response ? error.response.data : "System error");
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [url, prevUrl, input, prevInput, body, meth, opt, state.dcu]);

  return { isLoading, apiData, serverError };
};

export const useDispatchFetch = (dispatchFunction, props, input, opt) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();

  const prevInput = usePrevious(input);
  const prevDispatchFunction = usePrevious(dispatchFunction);

  useEffect(() => {
    if (
      (input && JSON.parse(prevInput) !== JSON.parse(input)) ||
      prevDispatchFunction !== dispatchFunction
    ) {
      if (!dispatchFunction) return;

      setIsLoading(true);
      setServerError(null);
      setApiData(null);
      const fetchData = async () => {
        try {
          const resp = await dispatch(dispatchFunction(props));
          const data = await resp?.data;
          setApiData(data);
          setIsLoading(false);
        } catch (error) {
          setServerError(error.response ? error.response.data : "System error");
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [input, prevInput, dispatchFunction, prevDispatchFunction, dispatch, props]);

  return { isLoading, apiData, serverError };
};
