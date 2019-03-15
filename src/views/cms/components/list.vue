<template>
  <container-full v-loading="loading" :has-relative="true">
    <template slot="header">
      <div class="header-title">{{ title }}-文章列表</div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" style="float: right; margin-bottom: -18px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="标题" style="width: 180px;" />
        </el-form-item>
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="searchForm.email" placeholder="邮箱" style="width: 120px;" />
        </el-form-item> -->
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
    <el-button v-if="categoryid > 0" type="primary" icon="el-icon-circle-plus" @click="handleAddArticle">
      新增
    </el-button>
    <el-button v-if="multipleSelection.length>0" type="danger" icon="el-icon-delete" @click="handleDeleteIds">
      批量删除
    </el-button>
    <!-- <el-popover placement="top-start" title="温馨提示" width="300" trigger="hover">
      <li>`用户名`与`邮箱`组合必须唯一</li>
      <el-button slot="reference" size="mini" icon="el-icon-info" style="float:right">
        操作提示
      </el-button>
    </el-popover> -->

    <!-- :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))" -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      highlight-current-row
      style="width: 100%"
      class="table-center"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="categoryid > 0"
        type="selection"
        width="40"/>
      <el-table-column
        type="index"
        width="40"
      />
      <el-table-column :show-overflow-tooltip="true" sortable="custom" prop="title" label="标题" min-width="150">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.username }}{{ scope.row.user_type == 1 ? '(管理员)': '' }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="type" label="类型" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" sortable="custom" prop="sort" label="排序" width="70" style="text-align: center;"/>
      <el-table-column prop="created_at" align="center" label="创建时间" min-width="100">
        <template slot-scope="scope">
          <div class="at-text">
            <span>{{ scope.row.created_at }}</span>
            <span>{{ scope.row.creator }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" align="center" label="修改时间" min-width="100">
        <template slot-scope="scope">
          <div class="at-text">
            <span>{{ scope.row.updated_at }}</span>
            <span>{{ scope.row.modifier }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="90" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="categoryid > 0"
            type="primary"
            size="mini"
            round
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id)"/>
          <el-button
            v-if="scope.row.type != 'page'"
            type="danger"
            icon="el-icon-delete"
            round
            size="mini"
            @click="handleDeleteArticle(scope.row)"/>
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
  </container-full>
</template>

<script>
import { mapGetters } from 'vuex'
import ContainerFull from '@/components/ContainerFull'
import * as articleService from '@/api/cms/article'
export default {
  name: 'ArticleList',
  components: {
    ContainerFull
  },
  props: {
    title: {
      type: String,
      default: '全部'
    },
    categoryid: {
      type: Number,
      default: 0
    },
    categoryData: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          type: '',
          articleid: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      searchForm: {
        title: ''
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
      typeMap: {
        'info': '资讯',
        'img': '图片',
        'page': '单页'
      },
      multipleSelection: [], // 多选列表，全部信息
      search: '',
      sex: ['保密', '男', '女'],
      state: ['禁用', '正常', '未验证'],
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
    categoryid: function(newValue, oldValue) {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const query = {
        current: this.page.currentPage,
        pageSize: this.page.pageSize,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        ...this.searchForm
        // filter: { ...this.searchForm }
        // ...this.searchForm
      }
      if (this.categoryid > 0) {
        query.categoryid = this.categoryid
      }
      this.loading = true
      const { data, success } = await articleService.getArticleList(query)
      if (success) {
        this.loading = false
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
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getList()
    },
    // 删除单个用户
    handleDeleteArticle(row) {
      if (row.type === 'page') {
        this.$message({
          message: '删除单页文章，需要到栏目管理里面直接删除栏目',
          type: 'warning'
        })
        return
      }
      this.$confirm(`您确定要删除这篇文章吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        articleService.delArticle(row.id).then((res) => {
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

      // 取出所有文章id
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
    // 编辑用户
    handleEdit(id) {
      const _data = {
        changestate: 'edit',
        categoryid: 0,
        articleid: id
      }
      this.$emit('changeArticle', _data)
    },
    // 添加文章
    handleAddArticle() {
      const _data = {
        changestate: 'add',
        categoryid: this.categoryid,
        articleid: 0
      }
      this.$emit('changeArticle', _data)
    },

    // 指量删除
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
        articleService.deleteArticleIds(_data).then((res) => {
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
.at-text{
  text-align: center;
  span{
    display: block;
  }
}
.header-title{
  display: inline-block;
  padding-top: 10px;
}
</style>
