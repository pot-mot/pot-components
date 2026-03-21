import EditList from './components/EditList.vue';
import ViewList from './components/ViewList.vue';

export {GlobalConfig as ListGlobalConfig} from './components/GlobalConfig';

export {useClickOutside} from './utils/useClickOutside';
export {isIgnoreElement, isTargetIgnore} from './utils/checkIgnore.ts';
export {useIndexSelection} from './utils/indexSelection';

export type {IndexSelection} from './type/IndexSelection.ts';

export {EditList, ViewList};
