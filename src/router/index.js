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
                    path: '/url',
                    component: () => import('../components/page/urlInfo/urlInfoTable.vue'),
                    meta: { title: '网址记录' }
                },{
                    path: '/member',
                    component: () => import('../components/page/car/member/memberTable.vue'),
                    meta: { title: '会员信息' }
                },{
                    path: '/project',
                    component: () => import('../components/page/car/project/projectTable.vue'),
                    meta: { title: '项目信息' }
                },{
                    path: '/level',
                    component: () => import('../components/page/car/level/levelTable.vue'),
                    meta: { title: '会员等级' }
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
