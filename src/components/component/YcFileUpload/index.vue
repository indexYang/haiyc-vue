<template>
    <el-upload 
        :action= "uploadUrl()"
        :data="uploadFormData"
        :headers="uploaHeaders"
        :limit="3"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-change="uploadFileChange"
        :on-success="uploadFileSuccess" 
        :on-error="uploadFileError" 
        :on-exceed="uploadFileExceed"
        :on-remove="uploadFileRemove"
    >
        <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
</template>

<script>
export default {
    name: 'ycFileUploadComponent',
    data () {
        let userInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
        return {
            uploaHeaders: {
                token: userInfo.token
            },
            uploadFormData: {
                fileType: ""
            },
        }
    },
    props: {
        uploadType: {
            type: Number
        },
        fileList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    created() {
        this.uploadFormData.type = this.uploadType
    },
    methods: {
        // 上传之前
        beforeUpload (file) {
            const m5 = 5 * 1024 * 1024
            this.uploadFormData.fileType = file.type
            if(file.size > m5) {
                this.$notify({
                    type: "warning",
                    position: "bottom-right",
                    customClass: 'notification-warning',
                    duration: 3000,
                    offset: 50,
                    title: "操作提醒",
                    message: '附件大小不能超过5M'
                });
                return false
            }
        },

        // 改变上传
        uploadFileChange (file, fileList) {
            this.$emit('upload-file-change', fileList)
        },

        // 上传成功
        uploadFileSuccess (response, file, fileList) {

        },

        // 上传删除
        uploadFileRemove (file, fileList) {
            this.$emit('upload-file-change', fileList)
        },

        // 上传失败
        uploadFileError (err, file, fileList) {
			console.log("err:",err);
            this.$notify({
                type: "error",
                position: "bottom-right",
                customClass: 'notification-warning',
                duration: 3000,
                offset: 50,
                title: "操作提醒",
                message: "上传附件失败"
            });
        },

        // 上传图片数量超出限制
        uploadFileExceed () {
            this.$notify({
                type: "warning",
                position: "bottom-right",
                customClass: 'notification-warning',
                duration: 3000,
                offset: 50,
                title: "操作提醒",
                message: '最多上传3个附件'
            });
        },
		//上传地址
		uploadUrl () {
			return process.env.VUE_APP_API_URL + '/upload/uploadFile.do';     
		}
    }
}
</script>

<style lang="scss" scoped>

</style>