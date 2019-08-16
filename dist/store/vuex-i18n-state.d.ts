export interface RootState {
}
export interface ModuleState {
    locale: string | null;
    fallback: string | null;
    translations: {
        [index: string]: any;
    };
}
export declare const init: () => {
    locale: null;
    fallback: null;
    translations: {};
};
