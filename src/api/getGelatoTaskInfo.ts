import axios, { RawAxiosRequestConfig } from "axios";

import { GelatoTask } from "src/models/gelatoTask";

const getGelatoTaskInfo = async (
  gelatoTaskId: string,
  options?: RawAxiosRequestConfig
): Promise<GelatoTask> => {
  const url = `https://relay.gelato.digital/tasks/status/${gelatoTaskId}`;

  const { data } = await axios.get(url, options);

  return data.task;
};

export default getGelatoTaskInfo;
