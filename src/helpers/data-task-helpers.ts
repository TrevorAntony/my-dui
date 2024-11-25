import { DuftHttpClient } from "../api/DuftHttpClient/DuftHttpClient";
import config from "../config";
import type { DataTaskResponse } from "../types/data-task";

const client = new DuftHttpClient(config.apiBaseUrl);

export const executeDataTask = async (
  id: string
): Promise<DataTaskResponse> => {
  const payload = {
    data_task_id: id,
    parameters: {},
  };

  const dataTaskResponse = await client.runDataTask(payload);

  return dataTaskResponse;
};
