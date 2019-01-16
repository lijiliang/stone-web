<template>
  <container-full>
    <template slot="header">
      <el-form ref="searchForm" :inline="true" :model="searchForm" style="margin-bottom: -18px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="searchForm.username" placeholder="用户名" style="width: 120px;" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="searchForm.email" placeholder="邮箱" style="width: 120px;" />
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
    <el-button type="primary" icon="el-icon-circle-plus" @click="handleAddUser">
      新增
    </el-button>
    <!-- <el-button v-if="multipleSelection.length>0" type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteIds">
      批量删除
    </el-button> -->
    <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
      <li>`用户名`与`邮箱`组合必须唯一</li>
      <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right">
        操作提示
      </el-button>
    </el-popover>

    <!-- :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))" -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="selection"
        width="40"/>
      <el-table-column
        type="index"
        width="40"
      />
      <el-table-column :show-overflow-tooltip="true" sortable="custom" prop="username" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}{{ scope.row.user_type == 1 ? '(管理员)': '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" sortable="custom" prop="email" label="邮箱" min-width="100"/>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span>{{ sex[scope.row.sex] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机"/>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="last_login_ip" label="最后登录ip"/>
      <el-table-column prop="last_login_time" label="最后登录时间" min-width="100"/>
      <el-table-column label="操作" fixed="right" min-width="90">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            round
            icon="el-icon-edit"
            @click="handleEdit(scope.row.userid)"/>
          <el-button
            type="danger"
            icon="el-icon-delete"
            round
            size="mini"
            @click="handleDeleteUser(scope.row.userid)"/>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total"
        :page-sizes="page.pageSizes"
        style="margin: -10px;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </template>
    <!-- 添加用户弹出层 -->
    <el-dialog
      :visible.sync="isAddUserDialog"
      :before-close="handleClose"
      :title="titleMap[titleState]"
      width="500px"
      custom-class="m-adduser-dialog">
      <add-user :edituserid="edituserid" @successCb="handleUserSuccess"/>
    </el-dialog>
  </container-full>
</template>

<script>
import { mapGetters } from 'vuex'
import ContainerFull from '@/components/ContainerFull'
import AddUser from './components/adduser'
import { getUser, deleteUser } from '@/api/user'
export default {
  name: 'SystemAdmin',
  components: {
    ContainerFull,
    AddUser
  },
  data() {
    return {
      searchForm: {
        username: '',
        email: ''
      },
      sort: {
        prop: '',
        order: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页
        pageSize: 15,	// 每页显示条目个数
        pageSizes: [15, 30, 50]
      },
      tableData: [],
      loading: true,
      search: '',
      sex: ['保密', '男', '女'],
      state: ['禁用', '正常', '未验证'],
      multipleSelection: [], // 多选列表，全部信息
      selectIds: [], // 选中的id
      titleMap: {
        'edit': '编辑用户',
        'add': '添加用户'
      },
      titleState: 'add',
      edituserid: '' // 编辑的userid
    }
  },
  computed: {
    ...mapGetters([
      'isAddUserDialog'
    ])
  },
  watch: {
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const query = {
        current: this.page.currentPage,
        pageSize: this.page.pageSize,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        filter: { ...this.searchForm }
        // ...this.searchForm
      }
      this.loading = true
      const { data, success } = await getUser(query)
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
    // 排序
    handleSortChange(val) {
      console.log(val)
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getList()
    },
    // 删除单个用户
    handleDeleteUser(userid) {
      this.$confirm(`您确定要删除这个用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(userid).then((res) => {
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
    // 多选
    handleSelectionChange(arr) {
      this.multipleSelection = arr

      // 取出所有用户id
      this.selectIds = arr.reduce(function(r, item) {
        for (var k in item) {
          if (k === 'userid') {
            r.push(item.userid)
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
    // 编辑用户
    handleEdit(userid) {
      this.titleState = 'edit'
      this.edituserid = userid
      this.$store.commit('SET_ADDUSER_VISIBLE', true)
    },
    // 添加用户
    handleAddUser() {
      this.titleState = 'add'
      this.edituserid = ''
      this.$store.commit('SET_ADDUSER_VISIBLE', true)
    },
    // 关闭弹出层
    handleClose(done) {
      this.edituserid = ''
      this.$store.commit('SET_ADDUSER_VISIBLE', false)
    },
    // 更新或添加用户成功后重新获取更新列表
    handleUserSuccess(data) {
      if (data) {
        this.getList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
