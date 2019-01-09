<template>
  <container-full>
    <template slot="header">
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="名称" style="width: 100px;" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="searchForm.path" placeholder="路径" style="width: 120px;" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-input v-model="searchForm.method" placeholder="方法" style="width: 120px;" />
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

    <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="add">
      新增
    </el-button>
    <el-button v-if="multipleSelection.length>0" type="danger" size="mini" icon="el-icon-delete" @click="batchDel">
      批量删除
    </el-button>
    <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
      <li>`名称`、`路径`与`方法`组合必须唯一</li>
      <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right">
        操作提示
      </el-button>
    </el-popover>
    <el-table v-loading="loading" :data="tableData" size="small" stripe highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange">

      <el-table-column type="selection" width="55"/>
      <el-table-column label="名称" prop="name" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="路径" prop="path" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="方法" prop="method" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.method }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="mini" icon="el-icon-edit" circle @click="openEditForm(scope.row)"/>
          <el-button type="danger" title="删除" size="mini" icon="el-icon-delete" circle @click="handleDel(scope.row.id)"/>
        </template>
      </el-table-column>

    </el-table>

    <template slot="footer">
      <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.total" :page-sizes="page.pageSizes" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </template>

    <edit-form :entity="entity" v-model="editFormVisible" @submit="getList" />
  </container-full>
</template>

<script>
import ContainerFull from '@/components/ContainerFull'
import editForm from './components/interfaceEditForm'
import * as interfaceService from '@/api/interface'
export default {
  name: 'InterfacePage',
  components: { ContainerFull, editForm },
  data() {
    return {
      searchForm: {
        name: '',
        path: '',
        method: ''
      },
      loading: false,
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
      editFormVisible: false
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
      const { success, data } = await interfaceService.getInterfacePagedList(query)
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
        interfaceService.delInterface(id).then((res) => {
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
    add() {
      this.entity = {}
      this.editFormVisible = true
    }
  }
}
</script>

<style scoped>

</style>
