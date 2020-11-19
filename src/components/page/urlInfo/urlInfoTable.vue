<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 网址信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.name" placeholder="名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button icon="el-icon-refresh-right" @click="resetForm()">重 置</el-button>
            </div>
			<el-divider></el-divider>
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-circle-plus-outline" class="handle-del mr10" @click="infoAdd">新增</el-button>
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
                <el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="account" label="账号"></el-table-column>
				<el-table-column prop="password" label="密码"></el-table-column>
				<el-table-column prop="url" label="url"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
						<el-button type="text" icon="el-icon-document" @click="getRowInfo(scope.row)">详情</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">删除</el-button>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px"  style="padding-right:60px;">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" show-word-limit maxlength="30"></el-input>
                </el-form-item>
				<el-form-item label="账号" prop="account">
				    <el-input v-model="form.account" placeholder="请输入账号" show-word-limit maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
				    <el-input v-model="form.password" placeholder="请输入密码" show-word-limit maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="url" prop="url">
				    <el-input v-model="form.url" placeholder="请输入url" show-word-limit maxlength="100"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
				    <el-input rows="4" cols="33" type="textarea" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="200"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 详情弹窗 -->
		<el-dialog class="dialogInfo" v-dialogDrag title="详情" :visible.sync="infoVisiable" width="43%" :close-on-click-modal="false">
			<el-row :gutter="20">
				<el-col :span="24"><div class="item-line one-line"><label>名称：</label>{{currentRow.name}}</div></el-col>		
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>账号：</label>{{currentRow.account}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>密码：</label>{{currentRow.password}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24"><div class="item-line one-line"><label>url：</label>{{currentRow.url}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>修改时间：</label>{{currentRow.modifyDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>修改人：</label>{{currentRow.modifierName}}</div></el-col> 
			</el-row>
			<el-row :gutter="20">				
				<el-col :span="12"><div class="item-line one-line"><label>创建时间：</label>{{currentRow.createDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>创建人：</label>{{currentRow.creatorName}}</div></el-col>
			</el-row>
			<div class="doc-info">
			    <el-divider content-position="left">备注</el-divider>
			    <div class="worklog-content">
			        <pre>{{currentRow.remark}}</pre>
			    </div>
			</div>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="infoVisiable = false">关 闭</el-button>
		    </div>
		</el-dialog>
    </div>
</template>

<script>
import { isAssetTypeAnImage } from '@/utils';
import * as urlApi from '../../../api/urlInfo.js';

export default {
    data() {
        return {
            query: {
                name: '',
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
			infoVisiable: false,
			initRuleForm: {
			    id: '',
			    name: '',
				account: '',
				password: '',
				url: '',
				remark: ''
			},
			rules: {
			          name: [
			            { required: true, message: '请输入名称', trigger: 'blur' },
			            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
			          ],
					  account: [
					    { required: true, message: '请输入账号', trigger: 'blur' },
					    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
					  ],
					  password: [
					    { required: true, message: '请输入密码', trigger: 'blur' },
					    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					  ],
					  url: [
					    { required: true, message: '请输入url', trigger: 'blur' },
					    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
					  ]
			        }
				};
			},
			components: {
			},
			created() {
				this.getData();
			},
			methods: {
				// 获取 easy-mock 的模拟数据
				getData() {
					this.loading = true;
					const {name, page, size} = this.query;
					urlApi.queryListUrlInfo({name, page, size}).then(res => {
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
				handleDelete(id) {
					this.$confirm("您是否确认要删除该条数据？", "提示", {
					    confirmButtonText: "确定",
					    cancelButtonText: "取消",
					    type: "warning"
					}).then(() => {
					    urlApi.delUrlInfo({id}).then(res => {
					        this.getData();
					    })
					}).catch(error => {
					    console.log(error)
					}); 
				},
				infoAdd() {
					this.initRuleForm = [];
					this.addOrUpTitle = '新增'
					this.editVisible = true;
				},
				// 编辑操作
				async handleEdit(row) {
					this.addOrUpTitle = '编辑';
					const { id } = row;
					const data = await this.getInfoByApi(id);
					this.form = {
					    ...data
					}
					this.editVisible = true;
				},
				// 保存编辑
				saveEdit(formName) {
					this.$refs[formName].validate(valid => {
					    if (valid) {
					        const {name, id, account, password, url, remark} = this.form;
					        urlApi.addOrModifyUrlInfo({name, id, account, password, url, remark}).then(res => {
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
				// 重置搜索
				resetForm () {
					this.query.name ='';
				},
				// 弹窗关闭重置表单
				resetModalForm () {
				    this.form = { ...this.initRuleForm }
				    this.$refs['form'].resetFields()
				},
				// 异步获取详情接口
				getInfoByApi (id) {
				    return urlApi.getUrlInfo({id}).then(res => {
				        const { data } = res
				        return data
				    })
				},
				// 获取详情
				async getRowInfo (row) {
				    const { id } = row
				    const data = await this.getInfoByApi(id);
				    this.currentRow = data;
					this.infoVisiable = true
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
	max-height: 60vh;
	overflow-y: auto;
	label{
		font-weight: bold;
		color: #606266;
	}
}

.doc-info{
        margin-top:45px;
        width: 100%;
        .worklog-content{
            padding: 0 20px;
            pre{
                width: 100%;
                white-space: pre-wrap;
                line-height: 26px;
                color:#333;
            }
        }
    }

</style>
