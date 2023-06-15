// third-party
import firebase from 'firebase/compat/app';

// project imports
import { UserProfile } from 'types/user-profile';

export type FirebaseContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => Promise<void>;
    login: () => void;
    firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    firebaseEmailPasswordSignIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: VoidFunction;
};

export type Auth0ContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: () => void;
    resetPassword: (email: string) => void;
    updateProfile: VoidFunction;
};

export interface JWTDataProps {
    userId: string;
}
export interface loginForm {
    username: string;
    password: string;
    captchaVerification: string;
    tenantName: string;
    rememberMe: boolean;
}
export type JWTContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: () => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    forgotPassword: (email: string) => void;
    resetPassword: (verificationCode: string, newPassword: string) => Promise<{ code: number; data: boolean | null; msg: string }>;
    updateProfile: VoidFunction;
};

export type AWSCognitoContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>;
    resetPassword: (email: string) => void;
};

export interface InitialLoginContextProps {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
}
