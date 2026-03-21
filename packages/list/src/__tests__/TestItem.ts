export type TestItem = {
    id: string;
    name: string;
};

export const createTestItems = (count: number): TestItem[] => {
    return Array.from({length: count}, (_, i) => ({
        id: `id-${i}`,
        name: `item ${i}`,
    }));
};
