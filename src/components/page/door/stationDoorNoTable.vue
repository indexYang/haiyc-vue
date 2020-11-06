<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 门户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.userNo" placeholder="用户编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.stationNo" placeholder="站点编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.stationName" placeholder="站点名称" class="handle-input mr10"></el-input>
				<!-- <el-input v-model="query.address" placeholder="地区" class="handle-input mr10"></el-input> -->
				<el-cascader
					placeholder="地区"
					class="handle-input mr10"
					filterable
				    :options="options"
				    :props="{ checkStrictly: true }"
					v-model="query.address"
				    clearable>
				</el-cascader>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button icon="el-icon-refresh-right" @click="resetForm()">重 置</el-button>
            </div>
			<el-divider></el-divider>
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-circle-plus-outline" class="handle-add mr10" @click="infoAdd">新增</el-button>
				<el-button type="primary" icon="el-icon-document-add" class="handle-add mr10" @click="importAdd">导入</el-button>
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
                <el-table-column prop="userNo" width="110" label="用户编号" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="userName" width="240" label="用户名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="electricityAddress" label="用电地址" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="stationNo" width="140" label="站点编号"></el-table-column>
				<el-table-column prop="stationName" label="站点名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="address" label="地区"></el-table-column>	
				<el-table-column prop="creatorName" label="创建人" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createDate" label="创建时间"></el-table-column>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="用户编号" prop="userNo">
                    <el-input v-model="form.userNo" placeholder="请输入用户编号" show-word-limit maxlength="30"></el-input>
                </el-form-item>
				<el-form-item label="用户名称" prop="userName">
				    <el-input v-model="form.userName" placeholder="请输入用户名称" show-word-limit maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="用电地址" prop="electricityAddress">
				    <el-input v-model="form.electricityAddress" placeholder="请输入用户地址" show-word-limit maxlength="50"></el-input>
				</el-form-item>
                <el-form-item label="站点编号" prop="stationNo">
					<el-select v-model="form.stationNo" filterable placeholder="请选择站点编号" style="width:300px;">
					    <el-option v-for="item in allBaseStation" :key="item.id" :label="`${item.id}_${item.stationName}`" :value="item.id"></el-option>
					</el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 导入 -->
		<el-dialog v-dialogDrag title="导入" :visible.sync="importVisible" width="35%" :close-on-click-modal="false" @closed="resetImExportForm">
			<div class="imExport-file">
			    <div class="mExport-file-step">
			        <p><span>1</span> 下载导入模板，并按照模板填写门户信息</p>
			        <p style="padding-left: 30px; padding-top: 20px;">
			            <el-button @click="downloadTemplate(1)">门户模板</el-button>
			        </p>
			    </div>
			    <div class="mExport-file-step">
			        <p><span>2</span> 选择要导入的文件，并上传</p>
			        <p style="padding-left: 30px; padding-top: 20px;">
			            <el-upload 
			                ref="upload" 
			                :action= "uploadUrl()"
			                :data="uploadData" 
			                :headers="uploaHeaders" 
			                :limit="1" 
			                :on-remove="handleRemove" 
			                :file-list="fileList" 
			                :on-change="uploadFileChange"
			                :on-success="uploadFileSuccess" 
			                :on-error="uploadFileError" 
			                :auto-upload="false"
			                :on-exceed="uploadFileExceed"
							:on-progress = "uploadProgress"
			                accept=".xlsx,.xls"
			            >
			                <el-button slot="trigger" type="primary">选择文件</el-button>
			            </el-upload>
			        </p>
			    </div>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="importVisible = false">取 消</el-button>
			    <el-button type="primary" @click="doImExportSubmit" v-preventReClick>确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- 详情弹窗 -->
		<el-dialog class="dialogInfo" v-dialogDrag title="详情" :visible.sync="stationDoorNoVisiable" width="43%" :close-on-click-modal="false">
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>用户编号：</label>{{currentRow.userNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>用户名称：</label>{{currentRow.userName}}</div></el-col>		
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>站点编号：</label>{{currentRow.stationNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>站点名称：</label>{{currentRow.stationName}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>地区：</label>{{currentRow.address}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>用电地址：</label>{{currentRow.electricityAddress}}</div></el-col>
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
		        <el-button @click="stationDoorNoVisiable = false">关 闭</el-button>
		    </div>
		</el-dialog>
    </div>
</template>

<script>
import * as doorNo from '../../../api/doorNo.js';
import * as commonApi from '../../../api/common.js';

export default {
    name: 'basetable',
    data() {
		 let userInfo = JSON.parse(localStorage.getItem('loginInfo'));
        return {
            query: {
                userNo: '',
                stationNo: '',
				stationName: '',
				address: [],
				provinceCode: '',
				cityCode: '',
				countyCode: '',
                page: 1,
                size: 10
            },
            tableData: [],
			currentRow: {},
            editVisible: false,
			importVisible: false,
            pageTotal: 0,
            form: {},
			addOrUpTitle:'',
			loading: false,
			notifyInstance:'',
			fileList: [],
			options:[],
			initRuleForm: {
			    id: '',
			    userNo: '',
				userName: '',
				electricityAddress: '',
				stationNo: ''			
			},
			rules: {
				userNo: [
						{ required: true, message: '请输入用户编号', trigger: 'blur' },
						{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
					  ],
				stationNo: [
						{required: true, message: "请选择站点", trigger: "change"}
					  ]
			},
			allBaseStation: [],
			stationDoorNoVisiable: false,
			uploadData: {},
			uploaHeaders: {
			    token: userInfo.token
			}
        };
    },
    created() {
        this.getData();
		this.getProvincesModel();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			this.loading = true;
			this.query.provinceCode = this.query.address[0];
			this.query.cityCode = this.query.address[1];
			this.query.countyCode = this.query.address[2];	
			const {userNo, stationNo, stationName, provinceCode, cityCode, countyCode, page, size} = this.query;
            doorNo.listStationDoorNoInfo({userNo, stationNo, stationName, provinceCode, cityCode, countyCode, page, size}).then(res => {
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
			   doorNo.delStationDoorNoInfo({id}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;
			doorNo.listAllBaseStation().then(res => {
			    this.allBaseStation = res.data;
			});
		},
		importAdd() {
			this.importVisible = true;
		},
        // 编辑操作
        async handleEdit(row) {
			doorNo.listAllBaseStation().then(res => {
			    this.allBaseStation = res.data;
			});
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
			        const {id, userNo, userName, electricityAddress, stationNo} = this.form;
			        doorNo.addOrModifyStationDoorNoInfo({id, userNo, userName, electricityAddress, stationNo}).then(res => {
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
			this.query.stationNo ='';
			this.query.stationName ='';
			this.query.address = [];
			this.query.provinceCode = '';
			this.query.cityCode = '';
			this.query.countyCode = '';
		},
		// 异步获取详情接口
		getInfoByApi (id) {
		    return doorNo.getStationDoorNoInfo({id}).then(res => {
		        const { data } = res
		        return data
		    })
		},
		// 获取详情
		async getRowInfo (row) {
		    const { id } = row
		    const data = await this.getInfoByApi(id);
		    this.currentRow = data
		    this.stationDoorNoVisiable = true
		},
		// 当弹窗关闭时候初始化表单数据
		resetImExportForm () {
		    this.fileList = [];
			if(this.notifyInstance) {
				this.notifyInstance.close();
			}
		},
		// 下载模版
		downloadTemplate () {
		     let fileUrl = process.env.VUE_APP_API_URL + '/template/station_doors_template.xlsx';  
		     location.href = fileUrl
		},
		//上传地址
		uploadUrl () {
			return process.env.VUE_APP_API_URL + '/doorNo/importDoorNos.do';     
		},
		// 删除所选文件
		handleRemove(file, fileList) {
		    this.fileList = fileList
		},
		// 上传文件改变
		uploadFileChange (file, fileList) {
		    this.fileList = fileList
		},
		// 上传中
		uploadProgress (event, file, fileList) {
			if(this.notifyInstance) {
				this.notifyInstance.close();
			}
		   this.notifyInstance = this.$notify({
		     title: '提示',
		     message: '正在积极导入中,请稍等...',
		     duration: 0,
		     position: 'bottom-right',
		     showClose: false,
			 type: 'warning'
		   });
		},
		// 导入修改成功
		uploadFileSuccess (response, file, fileList) {
			if(this.notifyInstance) {
				this.notifyInstance.close();
			}
		    if(response.code == 1) {
		        this.getData();
		        this.importVisible = false
		        this.$notify({
		            type: "success",
		            position: "bottom-right",
		            customClass: 'notification-success',
		            duration: 3000,
		            offset: 50,
		            title: "操作提醒",
		            message: '操作成功！'
		        });
		    } else {
		        this.$notify({
		            type: "error",
		            position: "bottom-right",
		            customClass: 'notification-error',
		            duration: 3000,
		            offset: 50,
		            title: "操作提醒",
		            message: response.message
		        });
		    }
		},
		// 导入修改错误
		uploadFileError (err, file, fileList) {
		    console.log(err)
		},
		// 上传文件超出限制
		uploadFileExceed () {
		    this.$notify({
		        type: "warning",
		        position: "bottom-right",
		        customClass: 'notification-warning',
		        duration: 3000,
		        offset: 50,
		        title: "操作提醒",
		        message: '文件超出个数限'
		    });
		},
		// 执行导入数据
		doImExportSubmit () {
		    if(this.fileList.length){
		        this.$refs.upload.submit()
		    } else {
		        this.$notify({
		            type: "warning",
		            position: "bottom-right",
		            customClass: 'notification-warning',
		            duration: 3000,
		            offset: 50,
		            title: "操作提醒",
		            message: '请选择要导入的文件'
		        });
		    }
		},
		getProvincesModel() {
			commonApi.listProvincesModel().then(res => {
			    this.options = res.data;
			});
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

.imExport-file{
	padding: 0 100px 0 40px;
	.mExport-file-step {
		padding-bottom: 20px;
		p {
			font-size:14px;
			span{
				display: inline-block;
				width: 24px;
				height: 24px;
				border-radius: 50%;
				text-align: center;
				line-height: 24px;
				font-size: 12px;
				border:1px solid #ddd;
			}
		}
	}
}
</style>
