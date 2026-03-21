# @potmot/list

基于 Vue3 + TypeScript
的通用列表组件库，提供编辑和视图两种列表，支持键盘操作、多选、剪贴板等功能。

## 特性

- 🔧 **TypeScript** - 完整的类型推导支持
- 🌐 **泛型支持** - 适用于任何数据类型
- 🎨 **完全可定制** - 支持自定义插槽（head、line、tail）
- 📦 **轻量级** - 依赖少，体积小
- ♿ **可访问性** - 支持键盘导航和焦点管理

### ViewList 组件

- ⌨️ **键盘快捷键**
    - `Ctrl/Cmd + A` - 全选
    - `Ctrl/Cmd + C` - 复制选中项
    - `Arrow Up` / `Arrow Down` - 切换选中项
- 🖱️ **鼠标交互** - 支持单选、多选、范围选择
- 📋 **剪贴板支持** - 复制 JSON 格式数据
- 🎯 **智能交互** - 自动识别交互式元素

### EditList 组件

- ⌨️ **键盘快捷键**
    - `Delete` / `Backspace` - 删除选中项
    - `Ctrl/Cmd + A` - 全选
    - `Ctrl/Cmd + C` - 复制选中项
    - `Ctrl/Cmd + X` - 剪切选中项
    - `Ctrl/Cmd + V` - 粘贴 JSON 数据
    - `Arrow Up` / `Arrow Down` - 上下移动选中项
    - `Enter` - 在选中项后插入新行
- 🖱️ **鼠标交互**
    - 点击选择单项
    - `Ctrl/Cmd + 点击` 多选
    - `Shift + 点击` 范围选择
- 📋 **剪贴板支持** - 复制/粘贴 JSON 格式数据
- ✅ **数据验证** - 支持自定义 JSON 验证器

## 快速开始

使用对应包管理器进行安装

```bash
npm install @potmot/list
```

```bash
yarn add @potmot/list
```

```bash
pnpm add @potmot/list
```

导入样式

```typescript
import '@potmot/list/es/index.css'
```

可根据需要覆盖样式变量

```css
:root {
    --potmot-list--text-color: #444;

    --potmot-list--bg-color: #fff;
    --potmot-list--bg-color--hover: #eee;
    --potmot-list--bg-color--selected: #89bdf4;

    --potmot-list--icon-color: #666;
    --potmot-list--icon-size: 1rem;
}
```

### EditList 简单使用示例

```vue
<script setup lang="ts">
  import {EditList} from '@potmot/list';
  import {ref} from 'vue';

  type EditListItem = {
      id: string;
      name: string;
      age: number;
  };

  const editListData = ref<EditListItem[]>([]);

  const nextId = ref(1);
  const defaultEditListData = (): EditListItem => ({
      id: `${nextId.value}`,
      name: `New Name`,
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
      for (const item of items) {
          item.id = `${nextId.value++}`;
      }
  };
</script>

<template>
    <EditList
        :lines="editListData"
        :to-key="(item) => item.id"
        :default-line="defaultEditListData"
        @copied="handleCopied"
        :pasteValidator="validateItem"
        :before-paste="beforePaste"
    >
        <template #line="{item}">
            <div class="line-item">
                <span>ID: {{ item.id }}</span>
                <span>姓名: {{ item.name }}</span>
                <span>年龄: {{ item.age }}</span>
            </div>
        </template>
    </EditList>
</template>
```
### ViewList 简单使用示例

```vue
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
</template>
```

## API 文档

### EditList Props

| 属性                    | 类型                                                             | 必填 | 说明                  |
|-----------------------|----------------------------------------------------------------|----|---------------------|
| lines                 | `T[]`                                                          | ✅  | 列表数据（支持 v-model）    |
| defaultLine           | `T \| (() => T \| Promise<T>)`                                 | ✅  | 默认新行数据或生成函数         |
| toKey                 | `(line: T, index: number) => string`                           | ✅  | 生成唯一键的函数            |
| pasteValidator        | `(json: any, onError?: ErrorHandler) => boolean \| Promise<T>` | ❌  | 粘贴验证函数              |
| interactiveClassNames | `string[]`                                                     | ❌  | 交互式元素的类名列表          |
| beforeCopy            | `(data: T[]) => void`                                          | ❌  | 复制前回调，可以在复制前对数据进行处理 |
| beforePaste           | `(data: T[]) => void`                                          | ❌  | 粘贴前回调，可以在粘贴前对数据进行处理 |

### ViewList Props

| 属性                    | 类型                                   | 必填 | 说明                  |
|-----------------------|--------------------------------------|----|---------------------|
| lines                 | `T[]`                                | ✅  | 列表数据                |
| toKey                 | `(line: T, index: number) => string` | ✅  | 生成唯一键的函数            |
| interactiveClassNames | `string[]`                           | ❌  | 交互式元素的类名列表          |
| beforeCopy            | `(data: T[]) => void`                | ❌  | 复制前回调，可以在复制前对数据进行处理 |

### EditList Events

| 事件名         | 参数                                        | 说明        |
|-------------|-------------------------------------------|-----------|
| click-item  | `(e: MouseEvent, item: T, index: number)` | 点击列表项时触发  |
| selected    | `(item: T, index: number)`                | 选中项时触发    |
| unselected  | `(item: T, index: number)`                | 取消选中时触发   |
| added       | `(added: T[])`                            | 添加项时触发    |
| deleted     | `(deleted: T[])`                          | 删除项时触发    |
| copied      | `(copied: T[])`                           | 复制成功时触发   |
| pasted      | `(pasted: T[])`                           | 粘贴成功时触发   |
| paste-error | `(error: Map<number, Error[]> \| any)`    | 粘贴验证失败时触发 |

### ViewList Events

| 事件名        | 参数                                        | 说明       |
|------------|-------------------------------------------|----------|
| click-item | `(e: MouseEvent, item: T, index: number)` | 点击列表项时触发 |
| selected   | `(item: T, index: number)`                | 选中项时触发   |
| unselected | `(item: T, index: number)`                | 取消选中时触发  |
| copied     | `(copied: T[])`                           | 复制成功时触发  |

### Slots

#### EditList / ViewList

| 插槽名  | 作用域参数                        | 说明                        |
|------|------------------------------|---------------------------|
| head | `{ lines: T[] }`             | 列表头部内容                    |
| line | `{ item: T, index: number }` | 列表项渲染                     |
| tail | `{ lines: T[] }`             | 列表尾部内容（EditList 默认包含添加按钮） |

### Expose

#### ViewListExpose

| 属性                      | 类型                         | 说明       |
|-------------------------|----------------------------|----------|
| listRef                 | `Ref<HTMLElement \| null>` | 列表容器引用   |
| bodyRef                 | `Ref<HTMLElement \| null>` | 列表主体引用   |
| focusList               | `() => void`               | 聚焦列表     |
| indexSelection          | `IndexSelection`           | 选择状态管理对象 |
| expandSelectionUpward   | `() => void`               | 向上扩充选中区间 |
| expandSelectionDownward | `() => void`               | 向下扩充选中区间 |

#### EditListExpose

| 属性                      | 类型                                           | 说明        |
|-------------------------|----------------------------------------------|-----------|
| listRef                 | `Ref<HTMLElement \| null>`                   | 列表容器引用    |
| bodyRef                 | `Ref<HTMLElement \| null>`                   | 列表主体引用    |
| focusList               | `() => void`                                 | 聚焦列表      |
| indexSelection          | `IndexSelection`                             | 选择状态管理对象  |
| expandSelectionUpward   | `() => void`                                 | 向上扩充选中区间  |
| expandSelectionDownward | `() => void`                                 | 向下扩充选中区间  |
| insert                  | `(index: number) => Promise<T>`              | 在指定位置插入新行 |
| remove                  | `(index: number) => Promise<T \| undefined>` | 删除指定位置的行  |
| moveUpSelection         | `() => Promise<void>`                        | 上移选中项     |
| moveDownSelection       | `() => Promise<void>`                        | 下移选中项     |

### IndexSelection API

| 方法/属性               | 类型                                       | 说明       |
|---------------------|------------------------------------------|----------|
| current             | `DeepReadonly<Ref<number \| undefined>>` | 当前选中项索引  |
| setCurrent          | `(index: number \| undefined) => void`   | 设置当前选中项  |
| selectedSet         | `DeepReadonly<Ref<Set<number>>>`         | 已选中的项集合  |
| isSelected          | `(index: number) => boolean`             | 判断是否选中   |
| select              | `(index: number \| number[]) => void`    | 选中指定索引   |
| selectRange         | `(start: number, end: number) => void`   | 选中范围     |
| unselect            | `(index: number \| number[]) => void`    | 取消选中指定索引 |
| unselectRange       | `(start: number, end: number) => void`   | 取消选中范围   |
| unselectAll         | `() => void`                             | 取消全部选中   |
| resetSelection      | `(indexes: number[]) => void`            | 重置选中状态   |
| resetSelectionRange | `(start: number, end: number) => void`   | 重置为范围选中  |

## License

MIT