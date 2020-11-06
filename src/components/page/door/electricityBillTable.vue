<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用电账单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.userNo" placeholder="用户编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.stationNo" placeholder="站点编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.stationName" placeholder="站点名称" class="handle-input mr10"></el-input>
				<el-date-picker
				  v-model="query.month"
				  type="month"
				  placeholder="选择月份"
				  value-format="yyyy-MM"
				  class="handle-input mr10">
				</el-date-picker>
				<el-date-picker
				  v-model="query.deductionDateView"
				  type="date"
				  class="handle-input mr10"
				  value-format="yyyy-MM-dd"
				  placeholder="选择扣费日期">
				</el-date-picker>  
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
                <el-table-column prop="userNo" label="用户编号" width="120" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="stationNo" width="130" label="站点编号"></el-table-column>
				<el-table-column prop="stationName" label="站点名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="address" label="地区"></el-table-column>
				<!-- <el-table-column prop="electricityAddress" label="用电地址" :show-overflow-tooltip="true"></el-table-column> -->
				<el-table-column prop="month" width="90" label="月份"></el-table-column>
				<el-table-column prop="electricityAmount" width="90" label="用电量"></el-table-column>
				<el-table-column prop="price" width="90" label="单价(元)"></el-table-column>
				<el-table-column prop="deductionPrice" width="90" label="扣费(元)"></el-table-column>
				<el-table-column prop="antiepidemicDiscounts" width="120" label="防疫优惠(元)"></el-table-column>
				<el-table-column prop="deductionDate" width="100" label="扣费日期"></el-table-column>
				<el-table-column prop="creatorName" width="85" label="创建人" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createDate" width="160" label="创建时间"></el-table-column>
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
				<el-form-item label="月份" prop="month">
					<el-col :span="11">
						<el-date-picker
							v-model="form.month"
							type="month"
							value-format="yyyy-MM"
							placeholder="选择月份">
						</el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item label="用电量" prop="electricityAmount">
					<el-input-number v-model="form.electricityAmount" size="medium" :precision="4" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="单价(元)" prop="price">
					<el-input-number v-model="form.price" size="medium" :precision="4" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="扣费(元)" prop="deductionPrice">
					<el-input-number v-model="form.deductionPrice" size="medium" :precision="4" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="防疫优惠(元)">
					<el-input-number v-model="form.antiepidemicDiscounts" size="medium" :precision="4" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="扣费日期" prop="deductionDate">
					<el-col :span="11">
					  <el-date-picker
						  v-model="form.deductionDate"
						  type="date"
						  style="width: 95%;"
						  value-format="yyyy-MM-dd"
						  placeholder="选择扣费日期">
						</el-date-picker>
					</el-col>
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
		<el-dialog class="dialogInfo" v-dialogDrag title="详情" :visible.sync="electricityBillVisiable" width="43%" :close-on-click-modal="false">
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>用户编号：</label>{{currentRow.userNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>用电地址：</label>{{currentRow.electricityAddress}}</div></el-col>
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>站点编号：</label>{{currentRow.stationNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>地区：</label>{{currentRow.address}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>站点名称：</label>{{currentRow.stationName}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>月份：</label>{{currentRow.month}}</div></el-col>	
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>用电量：</label>{{currentRow.electricityAmount}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>单价(元)：</label>{{currentRow.price}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>防疫优惠(元)：</label>{{currentRow.antiepidemicDiscounts}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>扣费(元)：</label>{{currentRow.deductionPrice}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24"><div class="item-line one-line"><label>扣费日期：</label>{{currentRow.deductionDate}}</div></el-col>
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
		        <el-button @click="electricityBillVisiable = false">关 闭</el-button>
		    </div>
		</el-dialog>
    </div>
</template>

<script>
import * as electricityBill from '../../../api/electricityBill.js';
export default {
    name: 'basetable',
    data() {
		 let userInfo = JSON.parse(localStorage.getItem('loginInfo'));
        return {
            query: {
                userNo: '',
                stationNo: '',
				stationName: '',
				month: '',
				deductionDateView: '',
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
			initRuleForm: {
			    id: '',
			    userNo: '',
				month: '',
				electricityAmount: undefined,
				price: undefined,
				deductionPrice: undefined, 
			    antiepidemicDiscounts: undefined,
				deductionDate: ''
			},
			rules: {
				userNo: [
						{ required: true, message: '请输入用户编号', trigger: 'blur' },
						{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
					  ],
				month: [
						{required: true, message: "请选择月份", trigger: "blur"}
					  ],
				electricityAmount: [
						{required: true, message: "请输入用电量", trigger: "blur"}
					  ],
				deductionPrice: [
						{required: true, message: "请输入扣费价格", trigger: "blur"}
					  ],
				deductionDate: [
						{required: true, message: "请选择扣费日期", trigger: "blur"}
					  ]					
			},
			allBaseStation: [],
			electricityBillVisiable: false,
			uploadData: {},
			uploaHeaders: {
			    token: userInfo.token
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
            electricityBill.listStationDoorNoElectricityBill(this.query).then(res => {
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
			   electricityBill.delStationDoorNoElectricityBill({id}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;

		},
		importAdd() {
			this.importVisible = true;
		},
        // 编辑操作
        async handleEdit(row) {
			this.addOrUpTitle = '编辑'
			const { id } = row;
			const data = await this.getInfoByApi(id);
			console.log("data:", data);
			this.form = {
			    ...data
			}
			if(!this.form.price){
				this.form.price = undefined;
			}
			if(!this.form.antiepidemicDiscounts){
				this.form.antiepidemicDiscounts = undefined;
			}
			console.log("form:", this.form);
			this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
			this.$refs[formName].validate(valid => {
			    if (valid) {
			        const {id, userNo, month, price,
					electricityAmount,deductionPrice,antiepidemicDiscounts,deductionDate} = this.form;
			        electricityBill.addOrModifyStationDoorNoElectricityBill({id, userNo, month,electricityAmount,price,
					deductionPrice,antiepidemicDiscounts,deductionDate}).then(res => {
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
			this.query.month ='';
			this.query.deductionDateView ='';
		},
		// 异步获取详情接口
		getInfoByApi (id) {
		    return electricityBill.getStationDoorNoElectricityBill({id}).then(res => {
		        const { data } = res
		        return data
		    })
		},
		// 获取详情
		async getRowInfo (row) {
		    const { id } = row
		    const data = await this.getInfoByApi(id);
		    this.currentRow = data
		    this.electricityBillVisiable = true
		    console.log(data)
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
		     let fileUrl = process.env.VUE_APP_API_URL + '/template/electricityBill_template.xlsx';  
		     location.href = fileUrl
		},
		//上传地址
		uploadUrl () {
			return process.env.VUE_APP_API_URL + '/electricityBill/importStationDoorNoElectricityBill.do';     
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
