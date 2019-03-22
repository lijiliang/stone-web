<template>
  <container-full>
    <template slot="header">
      <el-form ref="searchForm" :inline="true" :model="searchForm" style="margin-bottom: -18px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="标题" style="width: 120px;" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="searchForm.code" placeholder="编码" style="width: 120px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearchFormSubmit">
            查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-refresh" @click="handleSearchFormReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">
      新增
    </el-button>
    <el-button v-if="multipleSelection.length>0" type="danger" icon="el-icon-delete" @click="handleDeleteIds">
      批量删除
    </el-button>
    <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
      <li>角色权限管理</li>
      <el-button slot="reference" icon="el-icon-info" style="float:right">
        操作提示
      </el-button>
    </el-popover>
    <el-table v-loading="loading" :data="tableData" stripe highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange">

      <el-table-column type="selection" width="55"/>
      <el-table-column label="标题" prop="title" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="编码" prop="code" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="排序方式" prop="orderBy">
        <template slot-scope="scope">
          {{ orderBytypeOptions[scope.row.orderBy] }}
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <span :class="scope.row.enable ? 'state_yes' : 'state_no'">{{ scope.row.enable ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" icon="el-icon-edit" circle @click="openEditForm(scope.row)"/>
          <el-button type="danger" title="删除" icon="el-icon-delete" circle @click="handleDel(scope.row.id)"/>
          <el-button type="warning" title="关联列表" icon="el-icon-share" circle @click="openRoleUserDialog(scope.row)"/>
        </template>
      </el-table-column>

    </el-table>

    <template slot="footer">
      <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.total" :page-sizes="page.pageSizes" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </template>

    <edit-form :entity="entity" v-model="editFormVisible" @submit="getList" />
    <role-user :role="role" v-model="roleUserDialogVisible" />
    <role-permission :role="role" v-model="permissionDialogVisible" />
  </container-full>
</template>

<script>
import ContainerFull from '@/components/ContainerFull'
import editForm from './components/recommendEdit'
import roleUser from '../system/components/roleUser'
import rolePermission from '../system/components/rolePermission'
import * as RecommendService from '@/api/cms/recommend'
export default {
  name: 'CmsRecommendPage',
  components: { ContainerFull, editForm, roleUser, rolePermission },
  data() {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      loading: false,
      orderBytypeOptions: {
        sortAsc: '按序号升序',
        timeDesc: '按时间倒序'
      },
      tableData: [],
      multipleSelection: [], // 多选列表，全部信息
      selectIds: [], // 选中的id
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页
        pageSize: 15,	// 每页显示条目个数
        pageSizes: [15, 30, 50]
      },
      sort: {
        prop: '',
        order: ''
      },
      entity: {},
      role: { id: '', name: '' },
      editFormVisible: false,
      permissionDialogVisible: false,
      roleUserDialogVisible: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      const query = {
        current: this.page.currentPage,
        pageSize: this.page.pageSize,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        ...this.searchForm
      }
      this.loading = true
      const { success, data } = await RecommendService.getList(query)
      if (success) {
        this.tableData = data.list
        this.page.total = data.total
        this.loading = false
      }
    },
    // 搜索
    handleSearchFormSubmit() {
      this.getList()
    },
    handleSearchFormReset() {
      this.$refs.searchForm.resetFields()
      this.getList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    // 多选
    handleSelectionChange(arr) {
      this.multipleSelection = arr
      // 取出所有id
      this.selectIds = arr.reduce(function(r, item) {
        for (var k in item) {
          if (k === 'id') {
            r.push(item.id)
          }
        }
        return r
      }, [])
    },
    handleSortChange(val) {
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getList()
    },
    // 删除
    async handleDel(id) {
      this.$confirm(`您确定要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RecommendService.del(id).then((res) => {
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
    openEditForm(entity) {
      this.entity = entity
      this.editFormVisible = true
    },
    handleAdd() {
      this.entity = {}
      this.editFormVisible = true
    },
    // 批量删除
    async handleDeleteIds() {
      const ids = this.selectIds
      const _data = {
        ids: ids.join(',')
      }
      this.$confirm(`您确定要删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RecommendService.deleteIds(_data).then((res) => {
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
    },
    openRoleUserDialog(role) {
      this.role = role
      this.roleUserDialogVisible = !this.roleUserDialogVisible
    }
  }
}
</script>

<style scoped>

</style>
