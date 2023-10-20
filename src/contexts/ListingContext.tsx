import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { COUNTRY_LIST } from 'views/pages/listing-builder/data';

type CountryType = {
    icon: string;
    label: string;
};
type ListingContextType = {
    uid: string;
    setUid: (uid: string) => void;
    version: number;
    setVersion: (version: number) => void;
    country: CountryType;
    setCountry: (country: CountryType) => void;
};

const ListingContext = createContext<ListingContextType | null>(null);

export const ListingProvider = ({ children }: { children: React.ReactElement }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryUid = searchParams.get('uid');
    const queryVersion = searchParams.get('version');

    useEffect(() => {
        if (queryVersion && queryUid) {
            setVersion(Number(queryVersion));
            setUid(queryUid);
        }
    }, [queryUid, queryVersion]);

    const [uid, setUid] = useState('');
    const [version, setVersion] = useState(0);
    const [country, setCountry] = useState({
        icon: COUNTRY_LIST?.['0']?.icon,
        label: COUNTRY_LIST?.['0']?.label
    });

    return <ListingContext.Provider value={{ uid, setUid, version, setVersion, country, setCountry }}>{children}</ListingContext.Provider>;
};

export const useListing = () => {
    const context = useContext(ListingContext);
    return context!;
};
