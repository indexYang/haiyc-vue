import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },{
                    path: '/user',
                    component: () => import('../components/page/sys/user.vue'),
                    meta: { title: '用户信息' }
                },{
                    path: '/baseStation',
                    component: () => import('../components/page/baseStation/baseStationTable.vue'),
                    meta: { title: '基站信息' }
                },{
                    path: '/contract',
                    component: () => import('../components/page/contract/contractTable.vue'),
                    meta: { title: '铁通合同' }
                },{
                    path: '/construtionContract',
                    component: () => import('../components/page/contract/constructionContractTable.vue'),
                    meta: { title: '施工合同' }
                },{
                    path: '/doorNo',
                    component: () => import('../components/page/door/stationDoorNoTable.vue'),
                    meta: { title: '门户信息' }
                },{
                    path: '/electricityBill',
                    component: () => import('../components/page/door/electricityBillTable.vue'),
                    meta: { title: '用电账单' }
                },{
                    path: '/onTheElectricityBill',
                    component: () => import('../components/page/door/onTheElectricityBillTable.vue'),
                    meta: { title: '对上用电账单' }
                },{
                    path: '/forTheElectricityBill',
                    component: () => import('../components/page/door/forTheElectricityBillTable.vue'),
                    meta: { title: '对下用电账单' }
                }
				
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
