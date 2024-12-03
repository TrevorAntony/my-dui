import { client } from "..";
import type { DataTaskResponse } from "../types/data-task";

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
