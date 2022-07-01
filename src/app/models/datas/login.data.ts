import { User } from '../user';

export interface LoginData {
    user: User;
    token: string;
    refresh_token: string;
}