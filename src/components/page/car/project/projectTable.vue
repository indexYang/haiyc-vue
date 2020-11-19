<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  项目信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.projectName" placeholder="项目名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="projectName" label="项目名称"></el-table-column>
                <el-table-column prop="projectContent" width="600" :show-overflow-tooltip="true" label="项目内容"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
				<el-table-column prop="statusView" width="80" label="是否有效"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="form.projectName" placeholder="请输入项目名称" show-word-limit maxlength="30"></el-input>
                </el-form-item>
				<el-form-item label="项目内容">
				    <el-input rows="6" cols="33" type="textarea" v-model="form.projectContent" placeholder="请输入项目内容" show-word-limit maxlength="255"></el-input>
				</el-form-item>
				<el-form-item label="备注">
				    <el-input rows="6" cols="33" type="textarea" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="255"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as projectApi from '../../../../api/car/project.js';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                projectName: '',
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
			    id: '',
			    projectName: '',
				projectContent: '',
				remark: ''
			},
			rules: {
				projectName: [
				  { required: true, message: '请输入项目名称', trigger: 'blur' },
				  { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				]		  
			},
			dictionaryValues: [],
			options:[],
			infoVisiable: false	
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			this.loading = true;	
			const {projectName, page, size} = this.query;
            projectApi.listCarProjectInfo({projectName, page, size}).then(res => {
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
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
			   projectApi.delCarProjectInfo({id}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;
		},
        // 编辑操作
        async handleEdit(row) {
			this.addOrUpTitle = '编辑'
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
			        const {id, projectName, projectContent, remark} = this.form;
			        projectApi.addOrModifyCarProjectInfo({id, projectName, projectContent, remark}).then(res => {
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
		    this.query.projectName ='';
		},
		// 异步获取详情接口
		getInfoByApi (id) {
		    return projectApi.getCarProjectInfo({id}).then(res => {
		        const { data } = res;
		        return data;
		    })
		},
		// 获取详情
		async getRowInfo (row) {
		    const { id } = row
		    const data = await this.getInfoByApi(id);
		    this.currentRow = data
		    this.infoVisiable = true
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
