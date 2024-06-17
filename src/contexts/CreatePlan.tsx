import React, { createContext } from 'react';

const CreatePlan = createContext<any>(null);

const CreatePlanProvider = ({ children }: { children: React.ReactElement }) => {
    return <CreatePlan.Provider value={{ value: 1 }}>{children}</CreatePlan.Provider>;
};
export default CreatePlanProvider;
