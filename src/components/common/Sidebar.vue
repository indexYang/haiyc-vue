<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.child">
                    <el-submenu :index="item.menuUrl" :key="item.menuUrl">
                        <template slot="title">
                            <i :class="item.menuImage"></i>
                            <span slot="title">{{ item.menuName }}</span>
                        </template>
                        <template v-for="subItem in item.child">
                            <el-submenu
                                v-if="subItem.child"
                                :index="subItem.menuUrl"
                                :key="subItem.menuUrl"
                            >
                                <template slot="title">{{ subItem.menuName }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.child"
                                    :key="i"
                                    :index="threeItem.menuUrl"
                                >{{ threeItem.menuName }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.menuUrl"
                                :key="subItem.menuUrl"
                            >{{ subItem.menuName }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menuUrl" :key="item.menuUrl">
                        <i :class="item.menuImage"></i>
                        <span slot="title">{{ item.menuName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
import { rolePermissions } from '../../api/index';
export default {
    data() {
        return {
            collapse: false,
            items: []
        };
    },
	methods:{
		getData(){
			rolePermissions().then(res => {
				// 菜单权限
				this.items = res.data.listMenus;
				//按钮权限
				const listPermissions = res.data.listPermissions;
				return;
			});	
		}
	},
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
		 this.getData();
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 170px;
}
.sidebar > ul {
    height: 100%;
}
</style>
