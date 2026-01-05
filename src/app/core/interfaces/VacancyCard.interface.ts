export interface VacancyCard {
  id: number;
  rol: string;
  logoCompany?: string | undefined;
  creationDate: string;
  location: string;
  nameCompany?: string;
}

export interface JobDetail {
  id: number;
  cargo: string;
  empresa: string;
  ubicacion: {
    ciudad: string;
    provincia: string;
    pais: string;
  };
  modalidad: string;
  salario: string;
  jornada: string;
  experiencia: string;
}