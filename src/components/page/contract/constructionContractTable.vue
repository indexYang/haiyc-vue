<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 施工合同列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.id" placeholder="编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.name" placeholder="合同名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="id" label="编号" width="150"></el-table-column>
                <el-table-column prop="name" label="合同名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="electricityUser" label="用电方" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="powerSupplier" label="供电方" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="address" label="地区" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="electricityAddress" label="站点地址" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="startTime" width="105" label="合同开始时间" ></el-table-column>
				<el-table-column prop="endTime" width="105" label="合同结束时间" ></el-table-column>
				<el-table-column prop="price" width="105" label="电改单价(元)" ></el-table-column>
				<el-table-column prop="applyTypeView" width="100" label="结算方式"></el-table-column>
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
        <el-dialog v-dialogDrag :title="addOrUpTitle" :visible.sync="editVisible" width="44%" :close-on-click-modal="false" @closed="resetModalForm">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px"  style="padding-right:60px;">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="合同名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入合同名称" show-word-limit maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="用电方" prop="electricityUser">
                    <el-input v-model="form.electricityUser" placeholder="请输入用电方" show-word-limit maxlength="20"></el-input>
                </el-form-item>
				<el-form-item label="供电方" prop="powerSupplier">
				    <el-input v-model="form.powerSupplier" placeholder="请输入供电方" show-word-limit maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="地区" prop="address" v-if="addressHidden">
					<el-cascader  
						filterable
					    :options="options"
					    :props="{ checkStrictly: true }"
						v-model="form.address"
					    clearable></el-cascader>
				</el-form-item>
				<el-form-item label="地区" prop="address" v-if="addressHidden == false">
					<el-cascader disabled 
						filterable
					    :options="options"
					    :props="{ checkStrictly: true }"
						v-model="form.address"
					    clearable></el-cascader><span  style="padding-left:20px; color: red;">* 地区已和编号绑定,如需修改,删除新建</span>
				</el-form-item>
				<el-form-item label="站点地址" prop="electricityAddress">
				    <el-input v-model="form.electricityAddress" placeholder="请输入站点地址" show-word-limit maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="合同期限">
				    <el-col :span="11">
					  <el-date-picker
						  v-model="form.startTime"
						  type="date"
						  style="width: 95%;"
						  value-format="yyyy-MM-dd"
						  placeholder="选择开始日期">
						</el-date-picker>
				    </el-col>
					<el-col class="line" :span="1">-</el-col>
					<el-col :span="11">
					  <el-date-picker
						  v-model="form.endTime"
						  style="width: 95%;"
						  type="date"
						  value-format="yyyy-MM-dd"
						  placeholder="选择结束日期">
						</el-date-picker>
					</el-col>
				</el-form-item>
				
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="电改单价(元)"><el-input-number v-model="form.price" size="medium" :precision="4" :step="0.1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结算方式">
							<el-radio-group v-model="form.applyType">					
								<el-radio :label="1">背靠背结算</el-radio>
								<el-radio :label="2">一次性结算</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>	
				
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="施工造价(元)">
							<el-input-number v-model="form.totalPrice" size="medium" :precision="2" :step="0.1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="签约时间">
							<el-col :span="11">
							  <el-date-picker
								  v-model="form.signingTime"
								  type="date"
								  style="width: 200%;"
								  value-format="yyyy-MM-dd"
								  placeholder="选择日期">
								</el-date-picker>
							</el-col>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="施工状态">
							<el-radio-group v-model="form.constructionStatus">					
								<el-radio :label="1">未施工</el-radio>
								<el-radio :label="2">施工中</el-radio>
								<el-radio :label="3">已施工</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col> -->
				</el-row>
					
				<!-- <el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="结算金额(元)">
							<el-input-number v-model="form.settlementAmount" size="medium" :precision="2" :step="0.1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结算日期">
							<el-col :span="11">
							  <el-date-picker
								  v-model="form.settlementDate"
								  type="date"
								  style="width: 214%;"
								  value-format="yyyy-MM-dd"
								  placeholder="选择日期">
								</el-date-picker>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-form-item label="附件" :required="true">
				    <yc-file-upload :upload-type="2" :file-list="fileList" @upload-file-change="uploadFileChange"></yc-file-upload>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')" v-preventReClick>确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 详情弹窗 -->
		<el-dialog class="dialogInfo" v-dialogDrag title="详情" :visible.sync="contractInfoVisiable" width="43%" :close-on-click-modal="false" @closed="resetFilePreview">
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>编号：</label>{{currentRow.id}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>合同名称：</label>{{currentRow.name}}</div></el-col>
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>用电方：</label>{{currentRow.electricityUser}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>供电方：</label>{{currentRow.powerSupplier}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>站点地址：</label>{{currentRow.electricityAddress}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>地区：</label>{{currentRow.address}}</div></el-col>	
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>电改单价(元)：</label>{{currentRow.price}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>结算方式：</label>{{currentRow.applyTypeView}}</div></el-col>	
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>合同开始时间：</label>{{currentRow.startTime}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>合同结束时间：</label>{{currentRow.endTime}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>施工造价(元)：</label>{{currentRow.totalPrice}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>签约时间：</label>{{currentRow.signingTime}}</div></el-col>
				<!-- <el-col :span="12"><div class="item-line one-line"><label>施工状态：</label>{{currentRow.constructionStatusView}}</div></el-col> -->
			</el-row>
<!-- 			<el-row :gutter="20">				
				<el-col :span="12"><div class="item-line one-line"><label>结算金额(元)：</label>{{currentRow.settlementAmount}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>结算日期：</label>{{currentRow.settlementDate}}</div></el-col>
			</el-row> -->
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>修改时间：</label>{{currentRow.modifyDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>修改人：</label>{{currentRow.modifierName}}</div></el-col> 
			</el-row>
			<el-row :gutter="20">				
				<el-col :span="12"><div class="item-line one-line"><label>创建时间：</label>{{currentRow.createDate}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>创建人：</label>{{currentRow.creatorName}}</div></el-col>
			</el-row>
		    <div class="contractInfot-info">
		        <el-divider content-position="left"><h4>附件</h4></el-divider>
		        <div class="worklog-content">
		            <el-upload
						action="xx"
		                :limit="3"
		                :file-list="filePreviewList"
		                :on-preview="handlePreview"
						:disabled= "true" 
		            >
					</el-upload>
		        </div>
		    </div>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="contractInfoVisiable = false">关 闭</el-button>
		    </div>
		</el-dialog>
		<!-- modal en -->
    </div>
</template>

<script>
import * as contractApi from '../../../api/construtionContract.js';
import YcFileUpload from "../../component/YcFileUpload/index.vue";
import { isAssetTypeAnImage } from '@/utils';
import * as commonApi from '../../../api/common.js';

export default {
    data() {
        return {
            query: {
                id: '',
                name: '',
				address: [],
				provinceCode: '',
				cityCode: '',
				countyCode: '',
                page: 1,
                size: 10
            },
            tableData: [],
			currentRow: {},
			fileList: [],
			filePreviewList: [],
            editVisible: false,
			options:[],
            pageTotal: 0,
            form: {},
			addOrUpTitle:'',
			loading: false,
			addressHidden: true,
			initRuleForm: {
			    id: '',
			    name: '',
				electricityUser: '',
				powerSupplier: '',
				address: '',
				electricityAddress: '',
				startTime: '',
				endTime: '', 
			    price: undefined,
				applyType: '',
				signingTime: '',
				totalPrice: undefined,
				constructionStatus: '',
				settlementAmount: undefined,
				settlementDate: '',
			    files: []
			},
			rules: {
			          name: [
			            { required: true, message: '请输入合同名称', trigger: 'blur' },
			            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
			          ],
					   electricityUser: [
					     { required: true, message: '请输入用电方', trigger: 'blur' },
					     { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					   ],
					   powerSupplier: [
					     { required: true, message: '请输入供电方', trigger: 'blur' },
					     { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					   ],
					   electricityAddress: [
					     { required: true, message: '请输入站点地址', trigger: 'blur' },
					     { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
					   ],
					   address: [
					     { required: true, message: '请选择地区', trigger: 'change' }
					   ]
			        },
			contractInfoVisiable: false		
				};
			},
			components: {
			    YcFileUpload
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
					const {id, name, provinceCode, cityCode, countyCode, page, size} = this.query;
					contractApi.listConstructionContract({id, name, provinceCode, cityCode, countyCode, page, size}).then(res => {
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
					    contractApi.delConstructionContract({id}).then(res => {
					        this.getData();
					    })
					}).catch(error => {
					    console.log(error)
					}); 
				},
				infoAdd() {
					console.log("新增:",this.form);
					this.initRuleForm = [];
					this.addOrUpTitle = '新增'
					this.editVisible = true;
					this.addressHidden = true;
				},
				// 编辑操作
				async handleEdit(row) {
					this.addOrUpTitle = '编辑'
					this.addressHidden = false;
					const { id } = row;
					const data = await this.getInfoByApi(id);
					const listAddress = [];
					if(data.provinceCode){
						listAddress[0] = data.provinceCode;
					}
					if(data.cityCode){
						listAddress[1] = data.cityCode;
					}
					if(data.countyCode){
						listAddress[2] = data.countyCode;
					}
					data.address = listAddress;
					this.form = {
					    ...data
					}
					
					if(!this.form.price){
						this.form.price = undefined;
					}
					if(!this.form.totalPrice){
						this.form.totalPrice = undefined;
					}
					if(!this.form.settlementAmount){
						this.form.settlementAmount = undefined;
					}
					
					if(data.files != null){
						this.fileList = data.files && data.files.map((file, index) => ({...file, name: file.fileName, url: process.env.VUE_APP_IMGVIEW_URL + file.filePath}));
					}
					this.editVisible = true;
				},
				// 保存编辑
				saveEdit(formName) {
					this.$refs[formName].validate(valid => {
					    if (valid) {
					        this.form.files = this.fileList && this.fileList.map(file => {
								return file.id ? {fileName: file.name, filePath: file.filePath} : {fileName: file.name, filePath:  file.response.data}
					        })
							
							this.form.provinceCode = this.form.address[0];
							this.form.cityCode = this.form.address[1];
							this.form.countyCode = this.form.address[2];
					        const {files,id, name, electricityUser, powerSupplier, electricityAddress,startTime,endTime, provinceCode, 
							cityCode, countyCode, price,applyType,signingTime,totalPrice,constructionStatus,settlementAmount,settlementDate} = this.form;
					        contractApi.addOrModifyConstructionContract({id,files, name, electricityUser, powerSupplier, electricityAddress,
							provinceCode, cityCode, countyCode, startTime,endTime,price,applyType,
							signingTime,totalPrice,constructionStatus,settlementAmount,settlementDate}).then(res => {
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
				    this.query.id ='';
					this.query.name ='';
					this.query.address = [];
					this.query.provinceCode = '';
					this.query.cityCode = '';
					this.query.countyCode = '';
				},
				// 获取上传附件
				uploadFileChange (files) {
				    this.fileList = files
				},
				// 弹窗关闭重置表单
				resetModalForm () {
				    this.form = { ...this.initRuleForm }
				    this.$refs['form'].resetFields()
				    this.fileList = []
				},
				resetFilePreview (){
					this.filePreviewList = []
				},
				// 异步获取详情接口
				getInfoByApi (id) {
				    return contractApi.getConstructionContract({id}).then(res => {
				        const { data } = res
				        return data
				    })
				},
				// 获取详情
				async getRowInfo (row) {
				    const { id } = row
				    const data = await this.getInfoByApi(id);
					this.filePreviewList = data.files && data.files.map(file => {
					    return {name: file.fileName, url: process.env.VUE_APP_IMGVIEW_URL + file.filePath};
					})|| []
				    this.currentRow = data
				    this.contractInfoVisiable = true
				    console.log(data)
				},
				handlePreview(file) {
					window.open(file.url);
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
.dialogInfo label{
		display: inline-block;
		width: 120px;
		font-weight: bold;
		text-align: right;
		padding-right: 12px;
}
.one-line{
	display: flex;
	margin-bottom: 15px;
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

.contractInfot-info{
        margin-top:10px;
        width: 100%;
        .worklog-content{
            padding-left: 34px;
            pre{
                width: 100%;
                white-space: pre-wrap;
                line-height: 26px;
                color:#333;
            }
        }
    }
</style>
