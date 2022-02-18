import Vue from 'vue';
import VueRouter from 'vue-router';

import Collection from '@/views/Collection';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Collection',
        component: Collection,
    },
    {
        path: '/external-search',
        name: 'External',
        component: () => import(/* webpackChunkName: "external" */ '@/views/External'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;