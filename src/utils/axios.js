import axios from "axios";

const axiosApiCall = axios.create({
  baseURL: process.env.API_URL || "",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "any",
    Accept: "application/json",
  },
});

// Add a request interceptor
axiosApiCall.interceptors.request.use(
  async function (config) {
    // config.baseURL = process.env.API_URL;
    // Do something before request is sent

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosApiCall.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    const responseBody = response?.data;

    if (response && response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }

    return responseBody;
    // return Promise.reject(error)
  }
);

export default axiosApiCall;
