export const GlobalConfig: {
    ignoreClassNames: string[];
    pasteErrorHandler: (error: Map<number, Error[] | null | undefined> | unknown) => void;
} = {
    ignoreClassNames: [],
    pasteErrorHandler: (error: Map<number, Error[] | null | undefined> | unknown) => {
        console.error('List paste error.', error);
    },
};
