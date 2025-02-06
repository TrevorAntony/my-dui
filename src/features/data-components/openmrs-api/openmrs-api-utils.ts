export interface Patient {
  OpenMRSID: string;
  identifier: string;
  gender: string;
  name: string;
  uuid: string;
  age: number;
}

export const patientExtractor = (appointments: any[]): Patient[] => {
  return appointments.map((appointment) => appointment.patient);
};

export const rawDataExtractor = (data: any): any => {
  return data;
};
