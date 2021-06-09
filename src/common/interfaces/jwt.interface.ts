import { Roles } from '../enum';

export interface IJwt {
  secret: string;
  expiresIn: string;
}

export interface JWT_PAYLOAD {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}
