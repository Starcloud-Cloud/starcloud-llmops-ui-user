import React, { useState, createContext } from 'react';
import { Details, Execute } from 'types/template';
const Execute = ({ Children }: { Children: React.ReactElement }) => {
    const [detail, setDetail] = useState(null as unknown as Details);
    //是否全部执行
    let isAllExecute = false;
    const [loadings, setLoadings] = useState<any[]>([]);
    //是否显示分享翻译
    const [isShows, setIsShow] = useState<any[]>([]);
    return (
        <ExecuteText.Provider
            value={{
                detail,
                setDetail,
                isAllExecute,
                loadings,
                isShows
            }}
        >
            {Children}
        </ExecuteText.Provider>
    );
};
export const ExecuteText = createContext<any>(null);
export default Execute;
