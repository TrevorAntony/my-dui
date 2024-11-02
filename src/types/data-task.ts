export type DataTask = {
  dashboard: string;
  icon: string;
  prompt: string;
  task: string;
  title: string;
  executeButtonText: string;
  cancelButtonText: string;
};

export type DataTaskResponse = {
  success: boolean;
  error?: string;
};
