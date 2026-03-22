<script setup lang="ts">
import {EditList} from '@potmot/list';
import {ref} from 'vue';

type EditListItem = {
    id: string;
    name: string;
    age: number;
};

const editListData = ref<EditListItem[]>([
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

const nextId = ref(4);
const defaultEditListData = (): EditListItem => ({
    id: `${nextId.value}`,
    name: `New Member - ${nextId.value++}`,
    age: 18,
});

const handleCopied = (data: EditListItem[]) => {
    alert(`复制了 ${data.map((it) => it.name).join(',')}`);
};

const validateItem = (item: any) => {
    if (typeof item !== 'object') {
        return false;
    }
    if (!item.id || !item.name || !item.age) {
        return false;
    }
    return !(
        typeof item.id !== 'string' ||
        typeof item.name !== 'string' ||
        typeof item.age !== 'number'
    );
};

const beforePaste = (items: EditListItem[]) => {
    alert('粘贴前数据的id将被覆写');
    for (const item of items) {
        item.id = `${nextId.value++}`;
    }
};

const handlePasted = (data: EditListItem[]) => {
    alert(`粘贴了 ${data.map((it) => it.name).join(',')}`);
};

const handlePasteFailed = (error: any) => {
    alert('粘贴错误：' + error);
};
</script>

<template>
    <div class="page">
        <h2 class="title">EditList</h2>

        <div class="example-view">
            <EditList
                :lines="editListData"
                :to-key="(item) => item.id"
                :default-line="defaultEditListData"
                @copied="handleCopied"
                :pasteValidator="validateItem"
                :before-paste="beforePaste"
                @pasted="handlePasted"
                @paste-failed="handlePasteFailed"
            >
                <template #line="{item}">
                    <div class="line-item">
                        <span>ID: {{ item.id }}</span>
                        <span>姓名: <input v-model="item.name" /></span>
                        <span>年龄: <input v-model.number="item.age" /></span>
                    </div>
                </template>
            </EditList>
        </div>

        <div class="description">
            <p>EditList 是一个可编辑列表组件，支持增删改查、键盘导航、剪贴板操作等功能。</p>
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
                        <td>切换当前项</td>
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
                        <td>调整选中范围</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + ↑/↓</td>
                        <td>整体移动选中项</td>
                    </tr>
                    <tr>
                        <td>Enter</td>
                        <td>在当前位置插入新项</td>
                    </tr>
                    <tr>
                        <td>Delete/Backspace</td>
                        <td>删除选中项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + C</td>
                        <td>复制选中项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + X</td>
                        <td>剪切选中项</td>
                    </tr>
                    <tr>
                        <td>Ctrl/Cmd + V</td>
                        <td>粘贴项目（将从文本转化，需要经过校验）</td>
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
