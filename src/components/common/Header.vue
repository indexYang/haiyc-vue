<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">HAIYC系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img v-bind:src='user.imgHead' />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{user.username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided command="editPwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
		<!-- 新增编辑弹出框 -->
		<el-dialog v-dialogDrag title="修改密码" :visible.sync="editVisible" width="35%" :close-on-click-modal="false" @closed="resetModalForm">
		    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
		        <el-form-item label="原密码" prop="oldPwd">
		            <el-input type="password" v-model="form.oldPwd" placeholder="请输入原密码"></el-input>
		        </el-form-item>
		        <el-form-item label="新密码" prop="newPwd">
		            <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码,字母+数字且6-20位"></el-input>
		        </el-form-item>
				<el-form-item label="确认密码" prop="confirmPwd">
				    <el-input type="password" v-model="form.confirmPwd" placeholder="请再次输入新密码"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="doUpdatePwd('form')">确 定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus';
import { loginout } from '../../api/index';
import * as userApi from '../../api/user.js';
export default {
    data() {
		var validatePass = (rule, value, callback) => {
		    if (value !== this.form.newPwd) {
		        callback(new Error('两次输入密码不一致!'));
		    } else {
		        callback();
		    }
		};
        return {
            collapse: false,
            fullscreen: false,
            name: '无名氏',
            message: 2,
			editVisible: false,
			form: {},
			initRuleForm: {
			    oldPwd: '',
				newPwd: '',
				confirmPwd: ''
			},
			rules: {
				oldPwd: [
						{
						    required: true,
						    message: "请输入原密码",
						    trigger: "blur"
						}
					  ],
				newPwd: [
						{
						    required: true,
						    message: "请输入新密码",
						    trigger: "blur"
						},
						{
						    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
						    message: "密码不符合规则，请重新输入",
						    trigger: "blur"
						}
					  ],
				confirmPwd: [
						{
						    required: true,
						    message: "请再次输入新密码",
						    trigger: "blur"
						},
						{ 
							validator: validatePass, 
							trigger: 'blur' 
						}
					  ]				
			},
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
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
				loginout().then(res => {
					if(res.code == 1){
						sessionStorage.removeItem('loginInfo');
						this.$router.push('/login');
					}else{
						that.$message.error(res.data.message);
						return ;
					}			
				});	   
            }else if(command == 'editPwd'){
				this.editVisible = true;
			}
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
		// 弹窗关闭重置表单
		resetModalForm () {
			this.form = { ...this.initRuleForm }
			this.$refs['form'].resetFields()
		},
		// 保存编辑
		doUpdatePwd(formName) {
			this.$refs[formName].validate(valid => {
			    if (valid) {
			        const {oldPwd, newPwd, confirmPwd} = this.form;
			        userApi.doUpdatePwd({oldPwd, newPwd, confirmPwd}).then(res => {
			            this.editVisible = false;
			        })
			    }
			})
		}
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 200px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
