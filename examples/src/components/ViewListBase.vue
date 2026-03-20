<script setup lang="ts">
import {ViewList} from '@potmot/list';
import {ref} from 'vue';

type ViewListItem = {
    id: string;
    name: string;
    age: number;
};

const viewListData = ref<ViewListItem[]>([
    {
        id: '1',
        name: 'Jack',
        age: 18,
    },
    {
        id: '2',
        name: 'Rose',
        age: 19,
    },
    {
        id: '3',
        name: 'Mary',
        age: 20,
    },
]);

const handleCopied = (data: ViewListItem[]) => {
    alert(`复制了 ${data.map((it) => it.name).join(',')}`);
};
</script>

<template>
    <div class="page">
        <h2 class="title">ViewList</h2>

        <div class="example-view">
            <ViewList
                :lines="viewListData"
                :to-key="(item) => item.id"
                @copied="handleCopied"
            >
                <template #line="{item}">
                    <div class="line-item">
                        <span>id: {{ item.id }}</span>
                        <span>名字: {{ item.name }}</span>
                        <span>年龄: {{ item.age }}</span>
                    </div>
                </template>
            </ViewList>
        </div>

        <div class="description">
            <p>一个可键盘导航的只读列表组件，支持鼠标和键盘选择、复制功能。</p>
            <table>
                <thead>
                    <tr>
                        <th>操作</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>点击</td>
                        <td>选中单项</td>
                    </tr>
                    <tr>
                        <td>↑/↓</td>
                        <td>移动当前项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + 点击</td>
                        <td>选中多项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + A</td>
                        <td>全选</td>
                    </tr>
                    <tr>
                        <td>Shift + ↑/↓</td>
                        <td>调整扩展选项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + C</td>
                        <td>复制选中项</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <textarea
            class="copy-test-textarea"
            placeholder="可以在这里粘贴复制到的内容"
        />
    </div>
</template>

<style scoped>
@import '../style/example-page.css';

.line-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>
