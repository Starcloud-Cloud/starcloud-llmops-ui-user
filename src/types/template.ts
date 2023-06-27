export interface Item {
    uid: string;
    name: string;
    description: string;
    categories: string[];
    tags: string[];
}
export interface Execute {
    index: number | undefined;
    stepId: string;
    steps: any;
}
