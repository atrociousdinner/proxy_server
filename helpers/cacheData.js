import redisConfig from "../redisConfig.js";
import { proxy_command } from "../command.js";

//Return cached data
export const cacheData = async (req, res, next) => {
  const { server_url } = await proxy_command();
  const url = server_url + req.originalUrl;
  if (req.method !== "GET") {
    next();
  }
  try {
    const cacheResult = await redisConfig.get(url);
    if (cacheResult) {
      const result = JSON.parse(cacheResult);
      if ((result.status >= 200) & (result.status < 300)) {
        res.setHeader("X-Cache", "HIT");
        res.status(result.status).send({
          fromCache: true,
          data: result.data,
          status: result.status,
        });
      }
      return;
    }
    next();
  } catch (err) {
    console.error("Cache error,  bypassing: ", err);
    next();
  }
};
