import axios from "axios";

//Fetch api data
export const fetchApiData = async ({ method, url, headers, body }) => {
    const axiosConfig = {
      method,
      url,
      headers: { ...headers, host: undefined },
      data: body,
      validateStatus: () => true,
    };
  
    try {
      const response = await axios(axiosConfig);
      console.log(`Request sent to the API`);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    } catch (err) {
      console.error(`Cannot fetch API: `, err);
      return {
        status: 502,
        data: { error: "Proxy Error" },
      };
    }
  };