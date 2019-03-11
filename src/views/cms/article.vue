<template>
  <container-full class="article-container">
    <el-row type="flex" class="h-full">
      <el-col
        :span="4"
        style="padding-top:15px; border-right: 1px solid #ebeef5;"
      >
        <el-tree
          ref="tree"
          :expand-on-click-node="false"
          :data="menuList"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="getMenuData"
        />
      </el-col>
      <el-col
        :span="20"
        class="m-article-c"
      >
        <article-list
          v-if="hasList"
          :title="listTitle"
          :categoryid="categoryid"
          :category-data="categoryData"
          @changeArticle="handleChangeArticle"
        />
        <article-edit
          v-if="!hasList"
          :title="listTitle"
          :changestate="changestate"
          :articleid="articleid"
          :categoryid="categoryid"
        />
      </el-col>
    </el-row>
    <!-- <edit-form
      v-model="editFormDialogVisible"
      @submit="getMenuList"
    /> -->

  </container-full>
</template>
<script>
import ContainerFull from '@/components/ContainerFull'
import * as categoryService from '@/api/cms/category'
import ArticleList from './components/list'
import ArticleEdit from './components/edit'
export default {
  name: 'ArticlePage',
  components: {
    ContainerFull,
    ArticleList,
    ArticleEdit
  },
  data() {
    return {
      formEdit: false,
      currentId: 0,
      menuList: [],
      defaultProps: {
        label: 'name'
      },
      menuform: {
        id: '',
        pid: 0,
        name: '', // 栏目名称
        en_name: '', // 英文栏目名称
        code: '', // 编码
        route: '', // 路由
        type: 'channel', // 类型
        url: '', // 外链
        image: '', // 栏目图
        description: '', // 描述
        meta_title: '', // seo标题
        meta_keywords: '', // seo关键词
        meta_description: '', // seo描述
        sort: 0, // 排序
        enable: false // 是否启用
      },
      typeOptions: [
        {
          value: 'channel',
          label: '栏目'
        },
        {
          value: 'page',
          label: '单页'
        },
        {
          value: 'link',
          label: '外链'
        }
      ],
      hasList: true, // 是否显示列表
      listTitle: '全部',
      categoryData: {},
      changestate: 'add', // 文章是编辑还是添加(add:添加，edit编辑)
      categoryid: 0, // 栏目id(获取列表或添加文章时用)
      articleid: 0 // 文章id(编辑文章或单页时用)
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { success, data } = await categoryService.getCategoryList()
      if (success) {
        const all = {
          id: 0,
          name: '全部',
          type: 'channel'
        }
        const arr = data
        arr.unshift(all)

        this.menuList = arr
      }
    },
    async getMenuData(_data) {
      const { id, name, type, articleid } = _data
      if (type === 'page') {
        this.hasList = false
        this.listTitle = name
        this.articleid = articleid
        this.changeState = 'edit'
      } else {
        this.hasList = true
        this.listTitle = name
        this.categoryid = id
      }
      this.categoryData = _data
    },
    // 在列表页编辑或新增文章
    handleChangeArticle(data) {
      console.log(data)
      const { changestate, categoryid, articleid } = data
      this.changestate = changestate
      this.categoryid = categoryid
      this.articleid = articleid
      this.hasList = false
    }
  }

}
</script>

<style lang="scss">
.article-container{
  .container-full__body{
    padding: 0;
  }
}

.container-full-relative .container-full__body{
  padding: 15px;
}
.h-full{
  height: 100%;
}
.m-article-c{
  height: 100%;
  overflow: hidden;
}
</style>
