<template>
  <container-full v-loading="loading" :has-relative="true">
    <template slot="header">
      {{ titleMap[changestate] }}文章
    </template>

    <el-form
      ref="articleform"
      :model="articleform"
      label-position="right"
      label-width="100px"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item
                label="所属栏目"
                prop="name"
              >
                <el-input
                  :disabled="true"
                  v-model="title"
                  placeholder="请输入栏目名称"
                />
              </el-form-item>
              <el-form-item
                label="文章类型"
                prop="type"
              >
                <el-select
                  v-model="articleform.type"
                  class="filter-item"
                  placeholder="请选择类型"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.velue"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="标题"
                prop="title"
              >
                <el-input
                  v-model="articleform.title"
                  placeholder="请输入标题"
                />
              </el-form-item>
              <el-form-item
                label="副标题"
                prop="subtitle"
              >
                <el-input
                  v-model="articleform.subtitle"
                  placeholder="请输入副标题"
                />
              </el-form-item>
              <el-form-item
                label="图片"
                prop="image"
              >
                <el-input
                  v-model="articleform.image"
                  placeholder="请输入图片"
                />
              </el-form-item>
              <el-form-item
                label="缩略图"
                prop="thumbnil"
              >
                <el-input
                  v-model="articleform.thumbnil"
                  placeholder="请输入缩略图"
                />
              </el-form-item>
              <el-form-item
                label="外链"
                prop="url"
              >
                <el-input
                  v-model="articleform.url"
                  placeholder="请输入外链"
                />
              </el-form-item>

              <el-form-item
                label="标签"
                prop="tag"
              >
                <el-input
                  v-model="articleform.tag"
                  placeholder="请输入标签"
                />
              </el-form-item>
              <el-form-item
                label="排序"
                prop="sort"
              >
                <el-input-number v-model="articleform.sort" :min="0" :max="1000" controls-position="right"/>
              </el-form-item>
              <el-form-item
                label="开始时间"
                prop="start_time"
              >
                <el-date-picker
                  v-model="articleform.start_time"
                  type="datetime"
                  placeholder="选择日期时间"/>
              </el-form-item>
              <el-form-item
                label="结束时间"
                prop="end_time"
              >
                <el-date-picker
                  v-model="articleform.end_time"
                  type="datetime"
                  placeholder="选择结束时间"/>
              </el-form-item>
              <el-form-item label="是否启用" prop="enable">
                <el-switch v-model="articleform.enable" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="简介" prop="intro">
            <el-input
              v-model="articleform.intro"
              type="textarea"
              placeholder="请输入简介"
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <tinymce :height="300" v-model="articleform.content"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SEO设置" name="second">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item
                label="seo标题"
                prop="meta_title"
              >
                <el-input
                  :rows="3"
                  v-model="articleform.meta_title"
                  type="textarea"
                  placeholder="请输入seo标题"
                  maxlength="100"
                  @input = "descInput('meta_title')"
                />
                <span class="text" style="float: right;color: #909399;">已输入{{ limit.meta_title }}/100 字</span>
              </el-form-item>
              <el-form-item
                label="seo关键字"
                prop="meta_keywords"
              >
                <el-input
                  :rows="3"
                  v-model="articleform.meta_keywords"
                  type="textarea"
                  placeholder="请输入seo关键字"
                  maxlength="100"
                  @input = "descInput('meta_keywords')"
                />
                <span class="text" style="float: right;color: #909399;">已输入{{ limit.meta_keywords }}/100 字</span>
              </el-form-item>
              <el-form-item
                label="seo描述"
                prop="meta_description"
              >
                <el-input
                  :rows="6"
                  v-model="articleform.meta_description"
                  type="textarea"
                  placeholder="请输入seo描述"
                  maxlength="220"
                  @input = "descInput('meta_description')"
                />
                <span class="text" style="float: right;color: #909399;">已输入{{ limit.meta_description }}/220 字</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="自定义参数" name="third">
          <div v-for="(item,index) in customParameter" :key="index" class="custom-input">
            自定义参数{{ index+1 }}：
            <el-input
              v-model="item.key"
              placeholder="key"/>
            <el-input
              v-model="item.value"
              style="width: 400px;"
              placeholder="value"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template slot="footer">
      <el-button type="primary" size="medium" @click="handleSave">保存</el-button>
    </template>
  </container-full>
</template>

<script>
import ContainerFull from '@/components/ContainerFull'
import Tinymce from '@/components/Tinymce'
import * as articleService from '@/api/cms/article'
export default {
  name: 'ArticleEdit',
  components: {
    ContainerFull,
    Tinymce
  },
  props: {
    title: {
      type: String,
      default: '全部'
    },
    changestate: {
      type: String,
      default: 'add'
    },
    articleid: {
      type: Number,
      default: 0
    },
    categoryid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      activeName: 'first',
      typeOptions: [
        {
          value: 'info',
          label: '资讯'
        },
        {
          value: 'img',
          label: '图片'
        },
        {
          value: 'page',
          label: '单页'
        }
      ],
      titleMap: {
        'add': '添加',
        'edit': '编辑'
      },
      articleform: {
        'id': '',
        'name': '', // 所属栏目
        'type': '', // 文章类型
        'title': '',
        'subtitle': '',
        'url': '', // 外链
        'image': '', // 图片
        'thumbnil': '', // 缩略图
        'tag': '', // 标签
        'sort': 1, // 排序
        'start_time': '',
        'end_time': '',
        'enable': true, // 是否启用
        'intro': '', // 简介
        'content': '',
        'meta_title': '',
        'meta_keywords': '',
        'meta_description': ''
      },
      limit: { // 限制字数
        meta_title: 0, // seo标题
        meta_keywords: 0, // seo关键词
        meta_description: 0 // seo描述
      },
      customParameter: [ // 自定义参数
        {
          key: '',
          value: ''
        },
        {
          key: '',
          value: ''
        },
        {
          key: '',
          value: ''
        }
      ]
    }
  },
  watch: {
    articleid: function(newValue, oldValue) {
      this.getArticle()
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    // 获取文章
    async getArticle() {
      if (this.changestate === 'edit') {
        this.loading = true
        const { data, success } = await articleService.getArticle(this.articleid)
        if (success) {
          this.loading = false
          this.articleform = data
        }
      } else {
        console.log('sdf')
      }
    },
    // 计算输入数
    descInput(limitValue) {
      var txtVal = this.articleform[limitValue].length
      this.limit[limitValue] = txtVal
    },
    // 保存
    async handleSave() {
      // const _data = {

      // }
      const { data, success } = await articleService.putArticle(this.articleid, this.articleform)
      if (success) {
        console.log(data)
        this.activeName = 'first'
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.custom-input{
  padding-bottom: 20px;
  .el-input{
    width: auto;
  }
}
.tinymce-container .mce-tinymce{
  box-sizing: border-box;
}
</style>
