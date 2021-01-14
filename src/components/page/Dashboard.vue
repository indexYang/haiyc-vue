<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img v-bind:src='user.imgHead' class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{user.username}}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
		
<!-- 		<el-row :gutter="20">
			<el-col :span="6">
				<el-card style="text-align: center; height: 250px;" shadow="always">
					<div>基站总数</div>
					<div>55</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="always">
				总是显示
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="always">
				总是显示
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="always">
				总是显示
				</el-card>
			</el-col>
		</el-row> -->
		
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
        };
    },
    computed: {
        user() {
        	let user = JSON.parse(sessionStorage.getItem('loginInfo'));
            let username = user ? user.userName : null;
        	let imgHead = user ? user.imgHead : null;
        	username = username ? username : this.name;
            return {
        		username,
        		imgHead
        	}
        }
    },
    methods: {
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}
.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
