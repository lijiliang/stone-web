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
    <div class="m-search">
      用户名：<el-input
        v-model="search"
        class="search-input"
        clear
        placeholder="输入关键字搜索"/>
    </div>

    <el-table
      v-loading="loading"
      :data="list.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
      :height="fullHeight"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column prop="content" label="内容"/>
      <el-table-column prop="username" label="姓名"/>
      <el-table-column prop="last_login_ip" label="客户端ip"/>
      <el-table-column prop="last_login_time" label="最后登录时间"/>
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
  </div>
</template>

<script>
import { getLoginLogs } from '@/api/logs'
const NAVBARHEIGHT = 170 // 导航高度
export default {
  data() {
    return {
      fullHeight: document.documentElement.clientHeight - NAVBARHEIGHT - 60,
      list: [],
      loading: true,
      total: 0, // 总页数
      currentPage: 1, // 当前页
      pageSize: 15,	// 每页显示条目个数
      pageSizes: [15, 30, 50],
      search: ''
    }
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
      const { data, success } = await getLoginLogs(this.currentPage, this.pageSize)
      if (success) {
        this.list = data.list
        this.total = data.total
        this.loading = false
      }
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
    }
  }
}
</script>

<style scoped lang="scss">
.m-search{
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  .search-input{
    width: 250px;
  }
}
</style>
