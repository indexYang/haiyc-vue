<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  会员信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-input v-model="query.cardNo" placeholder="会员卡号" class="handle-input mr10"></el-input>
				<el-select v-model="query.type" clearable filterable placeholder="请选择级别" style="width:300px;" class="handle-input mr10">
				    <el-option v-for="item in dictionaryValues" :key="item.valueId" :label="item.valueName" :value="item.valueId"></el-option>
				</el-select>
				<el-input v-model="query.phone" placeholder="手机号码" class="handle-input mr10"></el-input>
				<el-input v-model="query.carNum" placeholder="车牌号" class="handle-input mr10"></el-input>
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
                <el-table-column prop="cardNo" label="会员卡号"></el-table-column>
                <el-table-column prop="userName" label="会员姓名" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
				<el-table-column prop="carNum" label="车牌号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="valueName" label="开卡级别"></el-table-column>
			    <el-table-column prop="discount"  label="折扣"></el-table-column>
				<el-table-column prop="statusView" width="80" label="是否有效"></el-table-column>
				<el-table-column prop="limiteDate"  label="有效时间"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
						<el-button type="text" icon="el-icon-circle-plus-outline" @click="getRowInfo(scope.row)">项目管理</el-button>
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="padding-right:60px;">
                <el-form-item label="编号" hidden>
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号" prop="cardNo">
                    <el-input v-model="form.cardNo" placeholder="请输入会员卡号" show-word-limit maxlength="30"></el-input>
                </el-form-item>
				<el-form-item label="会员姓名" prop="userName">
				    <el-input v-model="form.userName" placeholder="请输入会员姓名" show-word-limit maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
				    <el-input v-model="form.phone" placeholder="请输入手机号码" show-word-limit maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="车牌号" prop="carNum">
				    <el-input v-model="form.carNum" placeholder="请输入车牌号" show-word-limit maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="开卡级别" prop="level">
				    <el-select v-model="form.level" clearable filterable placeholder="请选择开卡级别" style="width:300px;">
				        <el-option v-for="item in dictionaryValues" :key="item.valueId" :label="item.valueName" :value="item.valueId"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="折扣" prop="discount">
					<el-input-number v-model="form.discount" min="0" max="1" size="medium" :precision="2" :step="0.1"></el-input-number>
					<span  style="padding-left:20px; color: red;">* 1代表原价, 0.66代表66折</span>
				</el-form-item>
				<el-form-item label="可用储值" prop="money">
					<el-input-number v-model="form.money" size="medium" :precision="2" :step="0.1"></el-input-number>
				</el-form-item>
				<el-form-item label="是否有效" prop="status">
				    <el-radio-group v-model="form.status">					
						<el-radio :label="1">有效</el-radio>
						<el-radio :label="2">失效</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="有效时间" prop="limiteDate">
					<el-col :span="11">
					  <el-date-picker
						  v-model="form.limiteDate"
						  type="date"
						  style="width: 95%;"
						  value-format="yyyy-MM-dd"
						  placeholder="选择有效时间">
						</el-date-picker>
					</el-col>
				</el-form-item>	
				<el-form-item label="备注">
				    <el-input rows="4" cols="33" type="textarea" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="255"></el-input>
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
				<el-col :span="12"><div class="item-line one-line"><label>会员卡号：</label>{{currentRow.cardNo}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>会员姓名：</label>{{currentRow.userName}}</div></el-col>
			</el-row>	
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>手机号码：</label>{{currentRow.phone}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>车牌号：</label>{{currentRow.carNum}}</div></el-col> 
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24"><div class="item-line one-line"><label>开卡级别：</label>{{currentRow.valueName}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>折扣：</label>{{currentRow.discount}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>可用储值：</label>{{currentRow.money}}</div></el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12"><div class="item-line one-line"><label>是否有效：</label>{{currentRow.statusView}}</div></el-col>
				<el-col :span="12"><div class="item-line one-line"><label>有效时间：</label>{{currentRow.limiteDate}}</div></el-col>
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
import * as memberApi from '../../../../api/car/member.js';
import * as dictionaryApi from '../../../../api/dictionary.js';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                cardNo: '',
				type: '',
				phone: '',
				carNum: '',
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
			    cardNo: '',
				userName: '',
				phone: '',
				carNum: '',
				level: undefined,
				discount: undefined,
				money: undefined,
				limiteDate: '',
				remark: '',
				status: ''
			},
			rules: {
				cardNo: [
				  { required: true, message: '请输入会员卡号', trigger: 'blur' },
				  { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				],
				phone: [
						{ required: true, message: '请输入手机号码', trigger: 'blur' },
						{ pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: "手机号码格式不对", trigger: "blur"}
					  ], 
				level: [
					{ required: true, message: '请选择开卡级别', trigger: 'change' }
				],
				discount: [
				  { required: true, message: '请输入折扣', trigger: 'blur' },
				],
				status: [
					{ required: true, message: '请选择是否有效', trigger: 'change' }
				],
				limiteDate: [
					{ required: true, message: '请选择有效时间', trigger: 'change' }
				]		  
			},
			dictionaryValues: [],
			options:[],
			infoVisiable: false	
        };
    },
    created() {
        this.getData();
		this.getQueryModel();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			this.loading = true;
			const {cardNo, type, phone, carNum, page, size} = this.query;
            memberApi.listCarCardInfo({cardNo, type, phone, carNum, page, size}).then(res => {
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
			   memberApi.delCarCardInfo({id}).then(res => {
				   this.getData();
			   })
			})
			.catch(() => {});
        },
		infoAdd() {
			this.addOrUpTitle = '新增'
			this.editVisible = true;
			this.form = {
				limiteDate : '2100-12-31',
				status : 1,
				discount : 1,
				money : 0
			}
		},
        // 编辑操作
        async handleEdit(row) {
			this.addOrUpTitle = '编辑'
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
			this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
			this.$refs[formName].validate(valid => {
			    if (valid) {
			        const {id, cardNo, userName, phone, carNum,
			        level, discount, money, limiteDate, remark, status} = this.form;
			        memberApi.addOrModifyCarCardInfo({id, cardNo, userName, phone, carNum,
			        level, discount, money, limiteDate, remark, status}).then(res => {
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
		    this.query.cardNo ='';
			this.query.type ='';
			this.query.phone ='';
			this.query.carNum ='';
		},
		// 异步获取详情接口
		getInfoByApi (id) {
		    return memberApi.getCarCardInfo({id}).then(res => {
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
		},
		getQueryModel() {
			const typeCode = "LEVEL_TYPE";
			dictionaryApi.queryDictionaryType({typeCode}).then(res => {
			    this.dictionaryValues = res.data;
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
