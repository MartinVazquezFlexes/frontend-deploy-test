export interface ResponseContactTypeDTO {
  id: number;
  name: string;
}

export interface ResponseContactDTO {
  id: number;
  contactType: string; // nombre (ej "LinkedIn")
  value: string;
  label: string | null;
  fullName: string | null;
  createdAt: string; // "dd/MM/yyyy HH:mm:ss"
  updatedAt: string; // "dd/MM/yyyy HH:mm:ss"
}

export interface ContactUpdateDTO {
  id?: number;          // undefined si es nuevo
  value: string;        // url
  label: string;        // requerido en DB
  contactTypeId: number;
}
