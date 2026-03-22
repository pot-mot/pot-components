export const GlobalConfig: {
    ignoreClassNames: string[];
    copySuccessHandler: ((data: any[]) => void) | null | undefined;
    copyFailedHandler: ((error: any) => void) | null | undefined;
    pasteSuccessHandler: ((data: any[]) => void) | null | undefined;
    pasteFailedHandler: ((error: any) => void) | null | undefined;
} = {
    ignoreClassNames: [],
    copySuccessHandler: null,
    copyFailedHandler: (error: any) => {
        console.error('List copy failed.', error);
    },
    pasteSuccessHandler: null,
    pasteFailedHandler: (error: any) => {
        console.error('List paste failed.', error);
    },
};
