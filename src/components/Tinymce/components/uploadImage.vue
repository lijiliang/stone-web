<template>
  <div class="upload-container uploadImage">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :drag="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :headers="requestHeaders"
        :action="actionUrl"
        class="editor-slide-upload"
        list-type="picture-card">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Urls from '@/api/urls'

export default {
  name: 'UploadImage',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      actionUrl: `${process.env.BASE_API}${Urls.upload}`, // 上传链接
      requestHeaders: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('successCBK', this.fileList)
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const { success, data } = response
      var fileList = [...this.fileList]
      if (success) {
        fileList.push({ name: data.key, url: data.url })
        this.fileList = fileList
      }
    },
    handleRemove(file) {
      const uid = file.uid
      // const fileList = [...this.fileList]
      // fileList.forEach((item, index) => {
      //   console.log(item, index)
      // })
      this.fileList = this.fileList.filter(item => item.uid !== uid) // 去掉数组中不符合的项
    },
    beforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isIMAGE && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
<style>
.uploadImage .el-upload .el-upload-dragger{
    height:148px;
}
</style>

