import axios from "axios";

export const axiosInstanceCreator = (
  dcu,
  method,
  url,
  data,
  response = null
) => {
  return new Promise(function (resolve, reject) {
    try {
      if (dcu) {
        const axiosInstance = axios.create();
        // axiosInstance.defaults.headers.common["Authorization"] =
        //   "Bearer " + dcu.token;
        resolve(
          axiosInstance({
            method: "post",
            url: "/api/dcuapi",
            responseType: response && response,
            data: {
              id: dcu.id,
              meth: method,
              url: url,
              data: data,
            },
          })
        );
      } else {
        axios({
          method: method,
          url: url,
          data: data && data,
        }).then(res => {
          resolve(res);
        }).catch(err => {
          console.log(err);
          reject(err);
        });
      }
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });
};

export function getClientResolution() {
  const realWidth = window.screen.width * window.devicePixelRatio;
  const realHeight = window.screen.height * window.devicePixelRatio;
  return { width: realWidth, height: realHeight }
}
