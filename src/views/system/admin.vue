<template>
  <div class="components-container bgwhite">

    <!-- 循环输出，因为表格各项宽度不一，所以单独控制 -->
    <!-- <el-table-column
        v-for="item in titles"
        :key="item.column"
        :prop="item.column"
        :label="item.label"
       >
      </el-table-column> -->

    <div class="m-edit border-bottom-line">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAddUser">添加用户</el-button>

      <div class="m-search">
        用户名：<el-input
          v-model="search"
          class="search-input"
          clear
          placeholder="输入关键字搜索"/>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="list.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
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
      <el-table-column prop="username" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}{{ scope.row.user_type == 1 ? '(管理员)': '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span>{{ sex[scope.row.sex] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="100"/>
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
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      class="pagination-container"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>

    <!-- 添加用户弹出层 -->
    <el-dialog
      :visible.sync="isAddUserDialog"
      :before-close="handleClose"
      :title="titleMap[titleState]"
      width="500px"
      custom-class="m-adduser-dialog">
      <add-user :edituserid="edituserid" @successCb="handleUserSuccess"/>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddUser from './components/adduser'
import { getUser, deleteUser } from '@/api/user'
const NAVBARHEIGHT = 170 // 导航高度
export default {
  name: 'SystemAdmin',
  components: {
    AddUser
  },
  data() {
    return {
      fullHeight: document.documentElement.clientHeight - NAVBARHEIGHT - 60,
      list: [],
      loading: true,
      total: 0, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15,	// 每页显示条目个数
      pageSizes: [15, 30, 50],
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
  },
  methods: {
    async getList() {
      this.loading = true
      const { data, success } = await getUser({ current: this.currentPage, pageSize: this.pageSize })
      if (success) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
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
.m-edit{
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}
.m-search{
  float: right;
  .search-input{
    width: 250px;
  }
}
</style>
