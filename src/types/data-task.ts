export type DataTask = {
  dashboard: string;
  icon: string;
  prompt: string;
  task: string;
  title: string;
  buttonName: string;
};

export type HandleDataTaskResponse = {
  success: boolean;
  error?: string;
};
