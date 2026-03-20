<script setup lang="ts">
import ViewListBase from './components/ViewListBase.vue';
import EditListBase from './components/EditListBase.vue';
import {ref} from 'vue';

const examples = {
    ViewListBase: {
        label: 'ViewList 基础演示',
        component: ViewListBase,
    },
    EditListBase: {
        label: 'EditList 基础演示',
        component: EditListBase,
    },
} as const;

type ExampleType = keyof typeof examples;

const currentExample = ref<ExampleType>('ViewListBase');
</script>

<template>
    <div class="main-page">
        <ul class="menu">
            <li
                v-for="(example, key) in examples"
                :key="key"
                class="menu-item"
                :class="{
                    selected: key === currentExample,
                }"
                @click="currentExample = key"
            >
                {{ example.label }}
            </li>
        </ul>
        <div class="section">
            <component :is="examples[currentExample].component" />
        </div>
    </div>
</template>

<style scoped>
.main-page {
    display: grid;
    grid-template-columns: 12rem 1fr;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.menu {
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid var(--line-color);
}

.menu-item {
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
}

.menu-item:hover {
    background-color: var(--bg-color--lighter);
}

.menu-item.selected {
    background-color: var(--active-color);
}

.section {
    height: 100%;
    overflow-y: auto;
}
</style>