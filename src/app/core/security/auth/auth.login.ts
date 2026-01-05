export interface EmailChangePasswordRequestDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface LoginResponseDTO {
  user: UserLoginResponseDTO;
  jwt: Jwt;
}

export interface UserLoginResponseDTO {
  id: number;
  email: string;
}
export interface Jwt {
  token: string;
}

export interface EmailLoginRequestDTO {
  email: string;
  password: string;
}

export interface GoogleLoginRequestDTO {
  accessToken: string;
  role: string;
}
