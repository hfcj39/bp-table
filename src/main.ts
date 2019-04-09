import Vue from 'vue';
import App from './App.vue';
import BpTable from '@/components';

Vue.config.productionTip = false;

Vue.use(BpTable);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
