import { UserProfile } from 'types/user-profile';

export type History = {
    from?: string;
    to?: string;
    time?: string;
    text?: string;
};

export interface ChatHistory {
    id?: number;
    from?: string;
    to?: string;
    text: string;
    time?: string;
}

export interface ChatStateProps {
    chats: ChatHistory[];
    user: UserProfile;
    users: UserProfile[];
    error: object | string | null;
}
export interface Charts {
    title: string;
    data: { x: string; y: string | number }[];
    key?: boolean;
    name?: string;
    subTitle?: string;
    errTitle?: string;
    successData?: { x: string; y: string | number }[];
    errData?: { x: string; y: string | number }[];
}
