export interface Item {
    uid: string;
    name: string;
    description: string;
    categories: string[];
    tags: string[];
}
export interface Execute {
    index: number;
    stepId: string;
    steps: any;
}
export interface Details {
    name: string;
    categories: string[];
    scenes: string[];
    example: string;
    viewCount: string;
    likeCount: string;
    installCount: string;
    uid: string;
    version: number;
    installStatus: any;
    workflowConfig: { steps: any[] };
}
