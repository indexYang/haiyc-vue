<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  会员等级信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.levelName" placeholder="等级名称" class="handle-input mr10"></el-input>
				<el-select v-model="query.status" placeholder="请选择是否有效类型" class="handle-input mr10">
				    <el-option
				      v-for="item in statusSelect"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
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
                <el-table-column prop="levelName" label="等级名称"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
				<el-table-column label="是否有效">
					<template scope="scope">
						<el-tag v-if="scope.row.status == 1" type="success">{{ scope.row.statusView }}</el-tag>
						<el-tag v-if="scope.row.status == 2" type="danger">{{ scope.row.statusView }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createDate" label="创建时间"></el-table-column>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="padding-right:60px;">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="等级名称" prop="levelName">
                    <el-input v-model="form.levelName" placeholder="请输入等级名称" show-word-limit maxlength="30"></el-input>
                </el-form-item>
				<el-form-item label="是否有效" prop="status">
				    <el-radio-group v-model="form.status">					
						<el-radio :label="1">有效</el-radio>
						<el-radio :label="2">失效</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="选择项目" prop="constructionContractNo">
				    <el-select v-model="form.projectIds" multiple clearable filterable :change="changeProject(form.projectIds)" placeholder="请选择项目" style="width:300px;">
				        <el-option v-for="item in allCarProject" :key="item.id" :label="`${item.projectName}`" :value="item.id"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item>
					<el-table :data="tableData" :show-header="false" border>
						<el-table-column prop="levelName" label="项目名称"></el-table-column>
						<el-table-column prop="levelName1" label="次数">
							<template scope="scope">
								<el-input-number v-model="scope.row.status" :min="0" :max="10"></el-input-number>&nbsp;&nbsp;次
							  </template>
						</el-table-column>
					</el-table>
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
import * as levelApi from '../../../../api/car/level.js';
import * as projectApi from '../../../../api/car/project.js';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                levelName: '',
				status:'',
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
				status: '',
			    levelName: '',
				remark: ''
			},
			rules: {
				levelName: [
				  { required: true, message: '请输入等级名称', trigger: 'blur' },
				  { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				],
				status:[
					{ required: true, message: '请选择是否有效', trigger: 'change'}
				]
			},
			statusSelect: [{
				value: '1',
				label: '有效'
			}, {
				value: '2',
				label: '失效'
			}],
			allCarProject: [],
			input: {
				num:0
			}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			this.loading = true;	
            levelApi.listCarCardLevel(this.query).then(res => {
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
			   levelApi.delCarCardLevel({id}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;
			this.form = {
				status : 1
			}
			this.getProjectModel();
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
			        const {id, status, levelName, remark} = this.form;
			        levelApi.addOrModifyCarCardLevel({id, status, levelName, remark}).then(res => {
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
			this.query.levelName ='';
		    this.query.status ='';	
		},
		// 异步获取详情接口
		getInfoByApi (id) {
		    return levelApi.getCarCardLevel({id}).then(res => {
		        const { data } = res;
		        return data;
		    })
		},
		// 获取详情
		async getRowInfo (row) {
		    const { id } = row
		    const data = await this.getInfoByApi(id);
		    this.currentRow = data
		},
		getProjectModel() {
			projectApi.findAllCarProjectInfo().then(res => {
			    this.allCarProject = res.data;
			});
		},
		changeProject(projectIds){
			if( projectIds !==undefined && projectIds.length > 0 ){
				//chauxn
			}	
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
