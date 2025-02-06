import { client } from "../../../core/api/DuftHttpClient/local-storage-functions";
import type { DataTaskResponse } from "./data-task";

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
