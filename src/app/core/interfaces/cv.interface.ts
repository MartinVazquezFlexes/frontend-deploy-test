export interface CvItem {
  id: number;
  cvUrl: string;
  name: string;
  creationDate: string;
  isLast: boolean;
}

export interface UploadedFile {
  id?: number;
  name: string;
  size?: number;
  url?: string;
  createdAt?: string;
  isLast?: boolean;
}