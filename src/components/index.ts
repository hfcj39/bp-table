import Bplist from './bp-list.vue';
import {
    Button,
    Table,
    Input,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Icon,
    CheckboxGroup,
    Checkbox,
    Page,
} from 'iview';

declare module 'iview/types/button' {
    export const Button: Button;
}
declare module 'iview/types/table' {
    export const Table: Table;
}
declare module 'iview/types/input' {
    export const Input: Input;
}
declare module 'iview/types/dropdown' {
    export const Dropdown: Dropdown;
    export const DropdownMenu: DropdownMenu;
    export const DropdownItem: DropdownItem;
}
declare module 'iview/types/icon' {
    export const Icon: Icon;
}
declare module 'iview/types/checkbox' {
    export const CheckboxGroup: CheckboxGroup;
    export const Checkbox: Checkbox;
}
declare module 'iview/types/page' {
    export const Page: Page;
}

import 'iview/dist/styles/iview.css';

const List = {
    install(Vue: any) {
        Vue.component('bptable', Bplist);
        Vue.component('Button', Button);
        Vue.component('Table', Table);
        Vue.component('Input', Input);
        Vue.component('Dropdown', Dropdown);
        Vue.component('DropdownMenu', DropdownMenu);
        Vue.component('DropdownItem', DropdownItem);
        Vue.component('CheckboxGroup', CheckboxGroup);
        Vue.component('Checkbox', Checkbox);
        Vue.component('Icon', Icon);
        Vue.component('Page', Page);
    },
};

export default List;
