<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.userNo" placeholder="编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.userName" placeholder="用户名称" class="handle-input mr10"></el-input>
				<el-input v-model="query.phone" placeholder="手机号码" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button icon="el-icon-refresh-right" @click="resetForm()">重 置</el-button>
            </div>
			<el-divider></el-divider>
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-circle-plus-outline" class="handle-add mr10" @click="infoAdd">新增</el-button>
			</div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
				v-loading="loading"
            >
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="userNo" label="编号"></el-table-column>
                <el-table-column prop="userName" label="用户名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="手机号码" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="roleNames" label="角色" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="creatorName" label="创建人" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column prop="createDate"  label="创建时间"></el-table-column>
				<el-table-column label="创建时间">{{tableData.createDate}}</el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
						<el-button type="text" icon="el-icon-document" @click="getRowInfo(scope.row)">详情</el-button>
						<el-button type="text" icon="el-icon-refresh-right" @click="resetPwd(scope.row.userNo)">重置密码</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.userNo)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增编辑弹出框 -->
        <el-dialog v-dialogDrag :title="addOrUpTitle" :visible.sync="editVisible" width="35%" :close-on-click-modal="false" @closed="resetModalForm">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="padding-right:60px;">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.userNo"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入用户名称" show-word-limit maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号码" show-word-limit maxlength="11"></el-input>
                </el-form-item>
				<el-form-item label="角色" prop="userRoles">
					<el-select v-model="form.userRoles" placeholder="请选择角色">
					    <el-option
					      v-for="item in userRoles"
					      :key="item.id"
					      :label="item.roleName"
					      :value="item.id">
					    </el-option>
					  </el-select>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 详情弹窗 -->
		<el-dialog class="dialogInfo" v-dialogDrag title="详情" :visible.sync="baseUserInfoVisiable" width="43%" :close-on-click-modal="false">
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>编号：</label>{{currentRow.userNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>用户名称：</label>{{currentRow.userName}}</div></el-col>
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>手机号码：</label>{{currentRow.phone}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>角色：</label>{{currentRow.roleNames}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>修改时间：</label>{{currentRow.modifyDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>修改人：</label>{{currentRow.modifierName}}</div></el-col> 
			</el-row>
			<el-row :gutter="20">				
				<el-col :span="12"><div class="item-line one-line"><label>创建时间：</label>{{currentRow.createDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>创建人：</label>{{currentRow.creatorName}}</div></el-col>
			</el-row>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="baseUserInfoVisiable = false">关 闭</el-button>
		    </div>
		</el-dialog>
    </div>
</template>

<script>
import * as userApi from '../../../api/user.js';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                userNo: '',
                userName: '',
				phone: '',
                page: 1,
                size: 10
            },
            tableData: [],
			currentRow: {},
            editVisible: false,
            pageTotal: 0,
            form: {},
			addOrUpTitle:'',
			loading: false,
			initRuleForm: {
			    userNo: '',
			    userName: '',
				phone: '',
				userRoles: ''
			},
			rules: {
				userName: [
						{ required: true, message: '请输入用户名称', trigger: 'blur' },
						{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
					  ],
				phone: [
						{ required: true, message: '请输入手机号码', trigger: 'blur' },
						{ pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: "手机号格式不对", trigger: "blur"}
					  ],
				userRoles: [
						{
						    required: true,
						    message: "请选择角色",
						    trigger: "change"
						}
					  ]			  
			},
			userRoles: [],
			baseUserInfoVisiable: false	
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			this.loading = true;
            userApi.listUsers(this.query).then(res => {
				this.loading = false;
                this.tableData = res.data.list;
                this.pageTotal = res.data.totalCnt;
				
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(userNo) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
			   userApi.delUser({userNo}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		// 重置密码
		resetPwd(userNo) {
		    // 二次确认删除
		    this.$confirm('确定要重置密码吗？', '提示', {
		        type: 'warning'
		    }).then(() => {
			   userApi.doResetPwd({userNo}).then(res => {
			   })
			})
			.catch(() => {});
		},
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;
			userApi.listAllRoles().then(res => {
			    this.userRoles = res.data;
			});
		},
        // 编辑操作
        async handleEdit(row) {
			userApi.listAllRoles().then(res => {
			    this.userRoles = res.data;
			});
			this.addOrUpTitle = '编辑'
			const { userNo } = row;
			const data = await this.getInfoByApi(userNo);
			this.form = {
			    ...data
			}
			if(null != data.roles){
				this.form.userRoles = data.roles[0].id;
			}
			this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
			this.$refs[formName].validate(valid => {
			    if (valid) {
			        const {userNo, userName, phone} = this.form;
					const userRoles = [];
					userRoles[0] = {roleId : this.form.userRoles};
			        userApi.addOrModifyUser({userNo, userName, phone, userRoles}).then(res => {
			            this.editVisible = false;
			            this.getData();
			        })
			    }
			})
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
		// 弹窗关闭重置表单
		resetModalForm () {
		    this.form = { ...this.initRuleForm }
		    this.$refs['form'].resetFields()
		},
		// 重置搜索
		resetForm () {
		    this.query.userNo ='';
			this.query.userName ='';
			this.query.phone ='';
		},
		// 异步获取详情接口
		getInfoByApi (userNo) {
		    return userApi.getUser({userNo}).then(res => {
		        const { data } = res;
		        return data;
		    })
		},
		// 获取详情
		async getRowInfo (row) {
		    const { userNo } = row
		    const data = await this.getInfoByApi(userNo);
		    this.currentRow = data
		    this.baseUserInfoVisiable = true
		    console.log(data)
		}
    }
};
</script>

<style lang="scss" scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.item-line{
        padding-bottom: 15px;
        font-size: 14px;    
}

.one-line{
	display: flex;
	margin-bottom: 15px;
}

.dialogInfo label{
		display: inline-block;
		width: 120px;
		font-weight: bold;
		text-align: right;
		padding-right: 12px;
}

/deep/ .el-dialog__body{
	padding: 10px 20px;
	max-height: 70vh;
	overflow-y: auto;
	label{
		font-weight: bold;
		color: #606266;
	}
}
</style>
