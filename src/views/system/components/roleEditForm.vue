<template>
  <el-dialog :visible.sync="dialogVisible" title="角色信息" @open="dialogOpen">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="name" label="角色名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="code" label="角色标识">
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '不能为空'}]" prop="description" label="描述">
        <el-input v-model="form.description" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import * as roleService from '@/api/permissions/role'
export default {
  name: 'RoleEditForm',
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
        code: '',
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
          roleService.getRole(this.entity.id).then(data => {
            const _data = data.data
            const form = {}
            form.name = _data.name
            form.code = _data.code
            form.description = _data.description
            this.form = form
          })
        } else {
          this.form = {}
        }
      })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.entity.id) {
            this._edit(this.entity.id)
          } else {
            this._create()
          }
          // roleService
          //   .handleSave({ ...this.form, id: this.entity.id })
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
      const { success, message } = await roleService.addRole({ ...this.form })
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
      const { success, message } = await roleService.putRole(id, { ...this.form })
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

