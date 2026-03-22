<script setup lang="ts" generic="T">
import {useIndexSelection} from '@/utils/indexSelection.ts';
import {useClickOutside} from '@/utils/useClickOutside.ts';
import {onBeforeUnmount, onMounted, toRaw, useTemplateRef} from 'vue';
import '@/style/list-variables.css';
import {writeText} from 'clipboard-polyfill';
import {cloneDeep} from 'lodash-es';
import {isIgnoreElement, isTargetIgnore} from '@/utils/checkIgnore.ts';
import type {ViewListExpose} from '@/type/ListExpose.ts';
import {GlobalConfig} from '@/components/GlobalConfig.ts';

const props = withDefaults(
    defineProps<{
        lines: T[];
        toKey: (line: T, index: number) => string;
        ignoreClassNames?: string[];
        beforeCopy?: (data: T[]) => void;
    }>(),
    {
        ignoreClassNames: () => GlobalConfig.ignoreClassNames,
    },
);

const emit = defineEmits<{
    clickItem: [e: MouseEvent, item: T, index: number];
    clickOutside: [e: MouseEvent];
    selected: [item: T, index: number];
    unselected: [item: T, index: number];
    copied: [items: T[]];
    copyFailed: [error: any];
}>();

const listRef = useTemplateRef<HTMLDivElement>('listRef');
const bodyRef = useTemplateRef<HTMLDivElement>('bodyRef');
const focusList = () => {
    if (document.activeElement && isIgnoreElement(document.activeElement, props.ignoreClassNames))
        return;
    listRef.value?.focus();
};

const indexSelection = useIndexSelection();
const onSelect = (index: number) => {
    const item = props.lines[index];
    if (item !== undefined) {
        emit('selected', item, index);
    }
};
const onUnselect = (index: number) => {
    const item = props.lines[index];
    if (item !== undefined) {
        emit('unselected', item, index);
    }
};
onMounted(() => {
    indexSelection.onSelect(onSelect);
    indexSelection.onUnselect(onUnselect);
});
onBeforeUnmount(() => {
    indexSelection.offSelect(onSelect);
});

const {
    current,
    setCurrent,
    selectedSet,
    isSelected,
    select,
    selectRange,
    unselect,
    unselectAll,
    resetSelection,
    resetSelectionRange,
} = indexSelection;
useClickOutside(
    () => bodyRef.value,
    (e) => {
        unselectAll();
        emit('clickOutside', e);
    },
);

const getSelectedItems = (): T[] => {
    const selectedItems: T[] = [];
    for (const [index, item] of props.lines.entries()) {
        if (selectedSet.value.has(index)) {
            selectedItems.push(item);
        }
    }
    return selectedItems;
};

const handleCopy = async () => {
    try {
        const selectedItems: T[] = getSelectedItems();
        const copyData = cloneDeep(toRaw(selectedItems));
        props.beforeCopy?.(copyData);
        await writeText(JSON.stringify(copyData));
        GlobalConfig.copySuccessHandler?.(copyData);
        emit('copied', copyData);
    } catch (e) {
        GlobalConfig.copyFailedHandler?.(e);
        emit('copyFailed', e);
    }
};

// 向上扩充选中区间
const expandSelectionUpward = () => {
    if (current.value === undefined) return;
    if (selectedSet.value.size <= 0) return;

    const oldCurrent = current.value;
    const minIndex = Math.min(...selectedSet.value);
    const maxIndex = Math.max(...selectedSet.value);
    if (minIndex === oldCurrent) {
        if (maxIndex - 1 >= 0) resetSelectionRange(minIndex, maxIndex - 1);
    } else if (maxIndex === oldCurrent) {
        if (minIndex - 1 >= 0) resetSelectionRange(minIndex - 1, maxIndex);
    }
    setCurrent(oldCurrent);
};

// 向下扩充选中区间
const expandSelectionDownward = () => {
    if (current.value === undefined) return;
    if (selectedSet.value.size <= 0) return;

    const oldCurrent = current.value;
    const minIndex = Math.min(...selectedSet.value);
    const maxIndex = Math.max(...selectedSet.value);
    if (minIndex === oldCurrent) {
        if (maxIndex + 1 < props.lines.length) resetSelectionRange(minIndex, maxIndex + 1);
    } else if (maxIndex === oldCurrent) {
        if (minIndex + 1 < props.lines.length) resetSelectionRange(minIndex + 1, maxIndex);
    }
    setCurrent(oldCurrent);
};

const handleItemClick = (e: MouseEvent, item: T, index: number) => {
    emit('clickItem', e, item, index);

    e.stopPropagation();
    e.stopImmediatePropagation();

    if (e.ctrlKey || e.metaKey) {
        if (!isSelected(index)) {
            select(index);
        } else {
            unselect(index);
        }
    } else if (e.shiftKey) {
        e.preventDefault();
        window.getSelection()?.removeAllRanges();
        if (current.value == undefined) {
            select(index);
            return;
        }
        selectRange(index, current.value);
    } else {
        if (!isTargetIgnore(e, props.ignoreClassNames)) {
            resetSelection([index]);
        }
    }
};

const prepareKeyboardEvent = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};

const handleKeyboardEvent = async (e: KeyboardEvent) => {
    if (isTargetIgnore(e, props.ignoreClassNames)) {
        return;
    }

    if (e.key === 'ArrowUp') {
        prepareKeyboardEvent(e);

        if (e.shiftKey) {
            expandSelectionUpward();
        } else if (current.value !== undefined && current.value - 1 >= 0) {
            resetSelection([current.value - 1]);
        }
    } else if (e.key === 'ArrowDown') {
        prepareKeyboardEvent(e);

        if (e.shiftKey) {
            expandSelectionDownward();
        } else if (current.value !== undefined && current.value + 1 < props.lines.length) {
            resetSelection([current.value + 1]);
        }
    } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'a') {
            prepareKeyboardEvent(e);

            resetSelection(Array.from(props.lines.keys()));
        } else if (e.key === 'c') {
            prepareKeyboardEvent(e);
            await handleCopy();
        }
    }
};

defineExpose<ViewListExpose>({
    listRef,
    bodyRef,
    indexSelection,
    expandSelectionUpward,
    expandSelectionDownward,
});
</script>

<template>
    <div
        ref="listRef"
        class="view-list"
        tabindex="-1"
        @keydown="handleKeyboardEvent"
        @mouseenter="focusList"
    >
        <div
            ref="bodyRef"
            class="view-list-body"
        >
            <slot
                name="head"
                :lines="lines"
            />

            <div
                v-for="(item, index) in lines"
                :key="toKey(item, index)"
                @click="(e: MouseEvent) => handleItemClick(e, item, index)"
                class="line-wrapper"
                :class="isSelected(index) ? 'selected' : ''"
            >
                <slot
                    name="line"
                    :item="item"
                    :index="index"
                />
            </div>

            <slot
                name="tail"
                :lines="lines"
            />
        </div>
    </div>
</template>

<style scoped>
.view-list {
    color: var(--potmot-list--text-color);
    background-color: var(--potmot-list--bg-color);
}

.view-list > .view-list-body > .line-wrapper:hover {
    background-color: var(--potmot-list--bg-color--hover);
}

.view-list > .view-list-body > .line-wrapper.selected {
    background-color: var(--potmot-list--bg-color--selected);
}

.view-list:focus {
    outline: 0;
}
</style>
