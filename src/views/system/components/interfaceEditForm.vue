<template>
  <el-dialog :visible.sync="dialogVisible" title="接口信息" @open="dialogOpen">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="name" label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="path" label="路径">
        <el-input v-model="form.path"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="method" label="方法">
        <el-input v-model="form.method"/>
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <el-input v-model="form.description" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="saveInterface">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import * as interfaceService from '@/api/interface'
export default {
  name: 'InterfaceEditForm',
  props: {
    entity: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        name: '',
        path: '',
        method: '',
        description: ''
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        if (this.entity.id) {
          interfaceService.getInterface(this.entity.id).then(data => {
            const _data = data.data
            const form = {}
            form.name = _data.name
            form.path = _data.path
            form.method = _data.method
            form.description = _data.description
            this.form = form
          })
        } else {
          this.form = {}
        }
      })
    },
    saveInterface() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.entity.id) {
            this._edit(this.entity.id)
          } else {
            this._create()
          }
          // interfaceService
          //   .saveInterface({ ...this.form, id: this.entity.id })
          //   .then(data => {
          //     this.loading = false
          //     this.dialogVisible = false
          //     this.$emit('submit')
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
        } else {
          return false
        }
      })
    },
    async _create() {
      const { success, message } = await interfaceService.addInterface({ ...this.form })
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.loading = false
        this.dialogVisible = false
        this.$emit('submit')
      } else {
        this.$message.error(message)
      }
    },
    async _edit(id) {
      const { success, message } = await interfaceService.putInterface(id, { ...this.form })
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.loading = false
        this.dialogVisible = false
        this.$emit('submit')
      }
    },
    close() {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
      this.loading = false
    }
  }
}
</script>

