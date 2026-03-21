import type {TestItem} from '@/__tests__/TestItem.ts';
import {h} from 'vue';
import {mount} from '@vue/test-utils';
import EditList from '@/components/EditList.vue';
import ViewList from '@/components/ViewList.vue';

export const mountViewList = (
    props: {
        lines?: TestItem[];
        toKey?: (item: TestItem, index: number) => string;
        ignoreClassNames?: string[];
        beforeCopy?: (data: TestItem[]) => void;
        onCopied?: () => void;
    } = {},
    slots?: {
        line?: any;
        head?: any;
        tail?: any;
    },
) => {
    const defaultSlots: any = {
        line: ({item, index}: {item: TestItem; index: number}) =>
            h('div', {class: 'line-content'}, `${item.name}-${index}`),
        ...slots,
    };

    return mount(ViewList, {
        props: {
            lines: props.lines ?? [],
            toKey: props.toKey ?? (((item: TestItem) => item.id) as any),
            ignoreClassNames: props.ignoreClassNames,
            beforeCopy: props.beforeCopy as any,
            onCopied: props.onCopied,
        },
        slots: defaultSlots,
        attachTo: document.body,
    });
};

export const mountEditList = (
    props: {
        lines?: TestItem[];
        toKey?: (item: TestItem, index: number) => string;
        defaultLine?: () => TestItem | Promise<TestItem>;
        ignoreClassNames?: string[];
        pasteValidator?: (json: any, onError?: any) => boolean;
        beforeCopy?: (data: TestItem[]) => void;
        onCopied?: () => void;
        beforePaste?: (data: TestItem[]) => void;
        onPasted?: () => void;
    } = {},
    slots?: {
        line?: any;
        head?: any;
        tail?: any;
    },
) => {
    const defaultSlots: any = {
        line: ({item, index}: {item: TestItem; index: number}) =>
            h('div', {class: 'line-content'}, `${item.name}-${index}`),
        ...slots,
    };

    return mount(EditList, {
        props: {
            lines: props.lines ?? [],
            toKey: props.toKey ?? (((item: TestItem) => item.id) as any),
            defaultLine: props.defaultLine ?? (() => ({id: 'default', name: 'default'})),
            ignoreClassNames: props.ignoreClassNames,
            pasteValidator: props.pasteValidator,
            beforeCopy: props.beforeCopy as any,
            onCopied: props.onCopied,
            beforePaste: props.beforePaste as any,
            onPasted: props.onPasted,
        },
        slots: defaultSlots,
        attachTo: document.body,
    });
};
