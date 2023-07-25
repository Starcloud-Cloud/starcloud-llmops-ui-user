export interface Item {
    uid: string;
    name: string;
    description: string;
    categories: string[];
    tags: string[];
    icon: string;
}
export interface Execute {
    index: number;
    stepId: string;
    steps: any;
}
export interface Details {
    name: string;
    description: string;
    categories: string[];
    scenes: string[];
    tags: string[];
    example: string;
    viewCount: string;
    likeCount: string;
    installCount: string;
    uid: string;
    version: number;
    installStatus: any;
    workflowConfig: { steps: any[] };
}
export interface Anyevent {
    initialValues: {
        name: string;
        desc: string;
        categories: string[];
        tags: string[];
    };
    setValues: (data: { name: string; value: string | string[] }) => void;
}
export type Rows = {
    field: string;
    label: string;
    type: string;
    style: string;
    isShow: boolean;
    value: string;
    defaultValue: string;
    description: string;
};
export interface Validas {
    variable: Rows[];
    variables: Rows[];
    responent: { style: string };
    index: number;
    basisChange: (data: { e: any; index: number; i: number; flag: boolean | undefined | null }) => void;
    setModal: (index: number) => void;
    setOpen: (flag: boolean) => void;
    setTitle: (data: string) => void;
    statusChange: (data: { i: number; index: number }) => void;
    editModal: (row: Rows, i: number, index: number) => void;
    delModal: (i: number, index: number) => void;
}
export interface El {
    value: null | undefined | string | boolean;
    defaultValue: null | undefined | string | boolean;
    isShow: boolean;
}
