import config from "../config";
import type { DataTaskResponse } from "../types/data-task";

export const executeDataTask = async (
  id: string,
  accessToken: string,
  logout: () => void,
): Promise<DataTaskResponse> => {
  const url = `${config.apiBaseUrl}/run-data-task`;
  const payload = {
    data_task_id: id,
    parameters: {},
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) logout();

    if (response.status === 202) {
      return { success: true };
    } else {
      return {
        success: false,
        error: `Unexpected status code: ${response.status}`,
      };
    }
  } catch (error) {
    console.error("There was an error running the data task:", error);
    return {
      success: false,
      error: "There was an error running the data task. Please try again.",
    };
  }
};
