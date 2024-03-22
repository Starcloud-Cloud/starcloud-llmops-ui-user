import { useState, createContext, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const MyApp = createContext<any>(null);
interface Variabe {
    variables?: {
        defaultValue?: string;
        description?: string;
        label?: string;
        field?: string;
        style?: string;
        isShow?: boolean;
        options?: any[];
        value: string | any[];
    }[];
}
interface Detail {
    name?: string;
    appUid?: string;
    model?: string;
    description?: string;
    publishUid?: string;
    configuration?: {};
    category?: string;
    scenes?: string[];
    tags?: string[];
    images?: string[];
    uid?: string;
    workflowConfig?: {
        steps?: {
            buttonLabel?: string;
            description?: string;
            name?: string;
            field?: string;
            flowStep?: {
                description?: string;
                response?: {
                    isShow?: boolean;
                    readonly?: boolean;
                    style?: string;
                    answer?: string;
                };
                variable?: Variabe;
            };
            variable?: Variabe;
        }[];
    };
}
const MyAppProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [detail, setDetail] = useState<Detail>({});
    return <MyApp.Provider value={{ detail, setDetail }}>{children}</MyApp.Provider>;
};
export default MyAppProvider;
