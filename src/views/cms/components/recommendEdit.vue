<template>
  <el-dialog :visible.sync="dialogVisible" title="推荐位信息" @open="dialogOpen">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item :rules="[{ required: true, message: '标题不能为空'}]" prop="title" label="标题">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '编码不能为空'}]" prop="code" label="编码">
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item prop="picPath" label="图片路径">
        <el-input v-model="form.picPath"/>
      </el-form-item>
      <el-form-item prop="orderBy" label="排序方式">
        <el-select
          v-model="form.orderBy"
          class="filter-item"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in orderBytypeOptions"
            :key="item.velue"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="form.enable" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="handleSave">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>

import * as RecommendService from '@/api/cms/recommend'
export default {
  name: 'RecommendEditForm',
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
      orderBytypeOptions: [
        {
          value: 'sortAsc',
          label: '按序号升序'
        },
        {
          value: 'timeDesc',
          label: '按时间倒序'
        }
      ],
      form: {
        title: '', // 标题
        code: '', // 编码
        picPath: '', // 图片路径
        orderBy: '', // 排序方式 sortAsc-按序号升序  timeDesc-按时间倒序
        enable: true // 是否启用
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
          RecommendService.get(this.entity.id).then(data => {
            const _data = data.data
            const form = {}
            form.title = _data.title
            form.code = _data.code
            form.picPath = _data.picPath
            form.orderBy = _data.orderBy
            form.enable = _data.enable
            this.form = form
          })
        } else {
          this.form = {
            title: '', // 标题
            code: '', // 编码
            picPath: '', // 图片路径
            orderBy: 'sortAsc', // 排序方式
            enable: true // 是否启用
          }
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
          // RecommendService
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
      const { success, message } = await RecommendService.add({ ...this.form })
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
      const { success, message } = await RecommendService.put(id, { ...this.form })
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

