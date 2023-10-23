import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ListingBuilderEnum } from 'utils/enums/listingBuilderEnums';
import { COUNTRY_LIST, DEFAULT_LIST } from 'views/pages/listing-builder/data';

type CountryType = {
    key: string;
    icon: string;
    label: string;
};
type ListType = {
    title: string;
    des: JSX.Element | string;
    placeholder: string;
    type: ListingBuilderEnum;
    maxCharacter: number;
    character: number;
    word: number;
    isOvertop?: boolean;
    value?: string;
    row: number;
    btnText: string;
    keyword: { text: string; num: number }[];
};

type ListingContextType = {
    uid: string;
    setUid: (uid: string) => void;
    version: number | undefined;
    setVersion: (version: number) => void;
    country: CountryType;
    setCountry: (country: CountryType) => void;
    list: ListType[];
    setList: (list: any) => void;
    enableAi: boolean;
    setEnableAi: (enableAi: boolean) => void;
};

const ListingContext = createContext<ListingContextType | null>(null);

export const ListingProvider = ({ children }: { children: React.ReactElement }) => {
    const [uid, setUid] = useState('');
    const [version, setVersion] = useState<number | undefined>();
    const [country, setCountry] = useState({
        key: COUNTRY_LIST?.['0']?.key,
        icon: COUNTRY_LIST?.['0']?.icon,
        label: COUNTRY_LIST?.['0']?.label
    });
    const [list, setList] = useState<ListType[]>(DEFAULT_LIST);
    const [enableAi, setEnableAi] = useState(true);
    const [keywordList, setKeywordList] = useState<any[]>([]);

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

    return (
        <ListingContext.Provider value={{ uid, setUid, version, setVersion, country, setCountry, list, setList, enableAi, setEnableAi }}>
            {children}
        </ListingContext.Provider>
    );
};

export const useListing = () => {
    const context = useContext(ListingContext);
    return context!;
};
