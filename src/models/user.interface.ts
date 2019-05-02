/**
 * Defines the structure of a User object.
 */
export interface User {
  active: boolean;
  createtAt: Date;
  email: string;
  id: string;
  roles: string[];
  updatedAt: Date;
  profilePictureUrl: string;
  completeName: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}