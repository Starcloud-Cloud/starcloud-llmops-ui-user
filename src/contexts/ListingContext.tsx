import { createContext, useContext, useState } from 'react';

type ListingContextType = {
    uid: string;
    setUid: (uid: string) => void;
    version: number;
    setVersion: (version: number) => void;
};

const ListingContext = createContext<ListingContextType | null>(null);

export const ListingProvider = ({ children }: { children: React.ReactElement }) => {
    const [uid, setUid] = useState('');
    const [version, setVersion] = useState(0);

    return <ListingContext.Provider value={{ uid, setUid, version, setVersion }}>{children}</ListingContext.Provider>;
};

const useListing = () => {
    const context = useContext(ListingContext);
    return context;
};
