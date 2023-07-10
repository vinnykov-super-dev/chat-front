export interface IUser{
    id: string;
    username: string;
    muted: boolean;
    banned: boolean;
    online?: boolean;
    color: string;
}