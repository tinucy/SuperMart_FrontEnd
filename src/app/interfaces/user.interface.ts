export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}
