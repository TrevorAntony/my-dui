import { patientExtractor } from "./openmrs-api-utils";

//improve these types as needed
export type DataTransformer = (data: any) => any;

const warnMissingAdapter = (key: string) => {
  console.warn(
    `[OpenMRS Adapter Warning] No adapter found for key "${key}". Data will be returned without transformation.`
  );
};

export const adapterRegistry: Record<string, DataTransformer> = {
  patientsFromAppointments: patientExtractor,
  // Add more adapters as needed
};

export const getAdapter = (key: string): DataTransformer | undefined => {
  const adapter = adapterRegistry[key];
  if (!adapter) {
    warnMissingAdapter(key);
  }
  return adapter;
};
