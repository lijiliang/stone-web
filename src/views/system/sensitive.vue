<template>
  <div class="components-container bgwhite">
    <div class="m-edit border-bottom-line">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDeleteIds">批量删除</el-button>

      <div class="m-search">
        敏感词：<el-input
          v-model="search"
          class="search-input"
          clear
          placeholder="输入关键字搜索"/>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="list.filter(data => !search || data.content.toLowerCase().includes(search.toLowerCase()))"
      :height="fullHeight"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"/>
      <el-table-column
        type="index"
        width="40"
      />
      <el-table-column prop="typeid" label="类型">
        <template slot-scope="scope">
          <span>{{ setTypename(scope.row.typeid) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="敏感词">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            round
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id)"/>
          <el-button
            type="danger"
            icon="el-icon-delete"
            round
            size="mini"
            @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      class="pagination-container"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>

    <!-- 添加弹出层 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="titleMap[titleState]"
      width="500px"
      custom-class="m-adduser-dialog">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm">
        <el-form-item label="敏感词" prop="content">
          <el-input v-model="ruleForm.content" placeholder="敏感词"/>
        </el-form-item>
        <el-form-item label="类型" prop="typeid">
          <el-select v-model="ruleForm.typeid" placeholder="请选择类型">
            <el-option v-for="item of sensitivetype" :label="item.typename" :value="item.typeid" :key="item.tyepid"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getSensitivetype, getSensitive, postSensitive, getSensitiveid, putSensitiveid, deleteSensitive, deleteSensitiveIds } from '@/api/sensitive'
const NAVBARHEIGHT = 170 // 导航高度

// 初始化表单数据
const initFormData = {
  content: '',
  typeid: 1
}
export default {
  data() {
    return {
      multipleSelection: [], // 多选列表，全部信息
      selectIds: [], // 选中的id
      sensitivetype: [], // 敏感字类型
      search: '',
      fullHeight: document.documentElement.clientHeight - NAVBARHEIGHT - 60,
      list: [],
      loading: true,
      total: 0, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15,	// 每页显示条目个数
      pageSizes: [15, 30, 50],
      titleMap: {
        'edit': '编辑',
        'add': '添加'
      },
      titleState: 'add',
      dialogVisible: false,
      editid: '',
      ruleForm: Object.assign({}, initFormData),
      rules: {
        content: [
          { required: true, message: '请输入敏感词', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    editid() {
      this._initFormData()
    },
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val
        this.timer = true
        setTimeout(() => {
          this.timer = false
        }, 500)
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this._getSensitivetype()

      this._initFormData()

      this.getList()
      // 计算搜索框的高度
      // this.searchHeight = this.$refs.formSearch.$el.clientHeight
      // this.$nextTick(() => {
      // })
      const that = this
      // 动态改变高度
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight
          that.fullHeight = window.fullHeight - NAVBARHEIGHT - 60
        })()
      }
    })
  },
  methods: {
    // 初始化数据
    _initFormData() {
      if (this.editid) {
        // this.$refs.ruleForm.resetFields()
        this._getEdit()
      } else {
        // this.$refs.ruleForm.resetFields()
        this.ruleForm = initFormData // 重置数据
      }
    },
    async _getEdit() {
      const { success, data } = await getSensitiveid(this.editid)
      if (success) {
        this.ruleForm = Object.assign({}, { content: data.content }, { typeid: data.typeid })
      }
    },
    // 敏感词类型
    async _getSensitivetype() {
      const { success, data } = await getSensitivetype()
      if (success) {
        this.sensitivetype = data
      }
    },
    async getList() {
      this.loading = true
      const { data, success } = await getSensitive(this.currentPage, this.pageSize)
      if (success) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
    },
    setTypename(typeid) {
      let typename = ''
      this.sensitivetype.map(item => {
        if (item.typeid === typeid) {
          typename = item.typename
        }
      })
      return typename
    },
    // 多选
    handleSelectionChange(arr) {
      this.multipleSelection = arr

      // 取出所有用户id
      this.selectIds = arr.reduce(function(r, item) {
        for (var k in item) {
          if (k === 'id') {
            r.push(item.id)
          }
        }
        return r
      }, [])
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search = ''
      this.getList()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search = ''
      this.getList()
      // console.log(`当前页: ${val}`)
    },
    // 添加
    handleAdd() {
      this.dialogVisible = true
      this.titleState = 'add'
      this.editid = ''
    },
    // 关闭
    handleClose() {
      this.editid = ''
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editid) {
            this._edit()
          } else {
            this._create()
          }
          // alert('submit!')
        } else {
          return false
        }
      })
    },
    // 创建
    async _create() {
      const { success, message } = await postSensitive(this.ruleForm)
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.dialogVisible = false
        this.$refs.ruleForm.resetFields()
        this.getList()
      }
    },
    // 编辑
    async _edit() {
      const { success, message } = await putSensitiveid(this.editid, this.ruleForm)
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.dialogVisible = false
        this.$refs.ruleForm.resetFields()
        this.getList()
      }
    },
    // 编辑
    handleEdit(id) {
      this.editid = id
      this.dialogVisible = true
      this._getEdit()
    },
    // 删除单个
    async handleDelete(id) {
      this.$confirm(`您确定要删除这个敏感词吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSensitive(id).then((res) => {
          const { success, message } = res || {}
          if (success) {
            this.$message({
              type: 'success',
              message: message
            })
            this.getList()
          }
        })
      }).catch(() => {
      })
    },
    // 批量删除
    async handleDeleteIds() {
      const ids = this.selectIds
      if (!ids.length) {
        this.$message.error('请选择要操作的记录')
        return
      }
      const _data = {
        ids: ids.join(',')
      }
      this.$confirm(`您确定要删除这些敏感词吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSensitiveIds(_data).then((res) => {
          const { success, message, data } = res || {}
          if (success) {
            this.$message({
              type: 'success',
              message: `${message},已成功删除${data.count}条数据`
            })
            this.getList()
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
.m-search{
  float: right;
  .search-input{
    width: 250px;
  }
}
.ruleForm{
  width: 400px;
}
</style>
