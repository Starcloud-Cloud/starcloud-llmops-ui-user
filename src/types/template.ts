export interface Item {
    uid: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    updateTime: number;
    creatorName: string;
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
    category: string;
    icon?: string;
    sort?: string;
    type?: string;
    images?: string;
    scenes: string[];
    tags: string[];
    example: string;
    viewCount: string;
    likeCount: string;
    installCount: string;
    uid: string;
    version: number;
    installStatus: any;
    publishUid?: string;
    workflowConfig: { steps: any[] };
}
export interface Anyevent {
    basisPre: number;
    initialValues: {
        name: string;
        description: string;
        category: string;
        tags: string[];
        example?: string;
    };
    appModel: { label: string; value: string }[] | undefined;
    sort: undefined | string;
    type: undefined | string;
    setValues: (data: { name: string; value: string | string[] }) => void;
    setDetail_icon: (data: any) => void;
}
export type Rows = {
    name: string;
    field: string;
    group: string;
    label: string;
    type: string;
    style: string;
    isShow: boolean;
    value: string;
    defaultValue: string;
    description: string;
};
export interface Validas {
    title?: string;
    handler?: string;
    variable: Rows[];
    variables: Rows[];
    responent: { readOnly?: boolean; style: string; type?: string; output?: { jsonSchema?: string } };
    buttonLabel: string;
    index: number;
    fields: string;
    variableStyle?: any[];
    allvalida: number | null;
    editChange: (data: { num: number; label: string; value: string; flag?: boolean }) => void;
    basisChange: (data: { e: any; index: number; i: number; flag: boolean | undefined | null; values?: boolean }) => void;
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
    style: string;
    field?: string;
}
