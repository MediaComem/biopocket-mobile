import { User } from './user.interface';

export class AuthResponse {
    token: string;
    user: User;
}