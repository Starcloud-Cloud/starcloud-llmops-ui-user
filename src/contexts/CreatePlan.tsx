import React, { createContext, useState } from 'react';
import { getPlan } from 'api/redBook/batchIndex';

const CreatePlan = createContext<any>(null);

const CreatePlanProvider = ({ children }: { children: React.ReactElement }) => {
    //获取的应用详情
    const [appData, setAppData] = useState<any>({});
    //判断是表格还是图片上传
    const [isTable, setIsTable] = useState(false);

    const getList = async () => {
        // const result = await getPlan({ appUid: searchParams.get('uid'), source: 'APP' });
    };
    return <CreatePlan.Provider value={{ appData: appData }}>{children}</CreatePlan.Provider>;
};
export default CreatePlanProvider;
