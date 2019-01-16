<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
    <el-tag>{{ role.name }}</el-tag>用户</div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini" style="margin-bottom: -18px;">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" placeholder="名称" style="width: 100px;" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="searchForm.email" placeholder="邮箱" style="width: 120px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchFormSubmit">
          查询
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleSearchFormReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" size="small" stripe highlight-current-row style="width: 100%;" @sort-change="handleSortChange">
      <el-table-column label="账号名称" prop="username">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户名称" prop="trueName">
        <template slot-scope="scope">
          {{ scope.row.trueName }}
        </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" label="邮箱" prop="email" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isAdd">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.isAdd" size="mini" type="info">未添加</el-tag>
          <el-tag v-if="scope.row.isAdd" size="mini" type="success">已添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.isAdd==1" type="primary" title="添加" size="mini" icon="el-icon-plus" circle @click="modifyRoleUser(scope.row.id,1)"/> -->
          <el-button v-if="!scope.row.isAdd" type="primary" title="添加" size="mini" icon="el-icon-plus" circle @click="modifyRoleUser(scope.row.userid,1)"/>
          <el-button v-if="scope.row.isAdd" type="danger" title="移除" size="mini" icon="el-icon-minus" circle @click="modifyRoleUser(scope.row.userid,0)"/>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="page.pageSizes" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </el-dialog>
</template>
<script>
import * as userService from '@/api/user'
import * as roleuserService from '@/api/permissions/roleuser'
export default {
  name: 'RoleUser',
  props: {
    role: {
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
      dialogVisible: false,
      searchForm: {
        name: '',
        email: ''
      },
      loading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页
        pageSize: 15,	// 每页显示条目个数
        pageSizes: [10, 15, 20]
      },
      sort: {
        prop: '',
        order: ''
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
    async dialogOpen() {
      this.getTableData()
    },
    async getTableData() {
      const query = {
        userType: 1,
        current: this.page.currentPage,
        pageSize: this.page.pageSize,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        roleId: this.role.id,
        // ...this.searchForm
        // descending: this.sort.order === 'descending',
        filter: { ...this.searchForm, roleId: this.role.id }
      }
      const { data, success } = await userService.getUser(query)
      if (success) {
        this.tableData = data.list
        this.page.total = data.total
        this.loading = false
      }
    },
    handleSearchFormSubmit() {
      this.getTableData()
    },
    handleSearchFormReset() {
      this.$refs.searchForm.resetFields()
    },
    handleSortChange(val) {
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getTableData()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    modifyRoleUser(userId, action) {
      roleuserService.addRoleUser({
        role_id: this.role.id,
        user_id: userId,
        action: action
      })
        .then((response) => {
          if (response.success) {
            const msg = action === 1 ? '已添加' : '已移除'
            this.$notify({
              title: '操作成功',
              message: msg,
              type: 'success'
            })
            setTimeout(() => {
              this.getTableData()
            }, 500)
          }
        })
    }
  }
}
</script>

