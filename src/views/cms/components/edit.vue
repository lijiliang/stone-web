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
                <el-input
                  v-if="articleform.type === 'page'"
                  :disabled="true"
                  value="单页"
                />
                <el-select
                  v-if="articleform.type !== 'page'"
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
                :rules="[
                  { required: true, message: '请输入标题', trigger: ['blur'] },
                ]"
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
                <img v-if="articleform.image" :src="articleform.image" class="articleImg">
                <UploadImg
                  :limit="1"
                  button-text="上传图片"
                  @successCBK="imageSuccessCBK"/>
                <el-button v-if="articleform.image" icon="el-icon-delete" size="mini" type="danger" @click="articleform.image=''">删除图片</el-button>
              </el-form-item>
              <el-form-item
                label="缩略图"
                prop="thumbnil"
              >
                <img v-if="articleform.thumbnil" :src="articleform.thumbnil" class="articleImg">
                <UploadImg
                  :limit="1"
                  button-text="上传缩略图"
                  tip="为确保响应式布局，缩略图需要固定尺寸：760*380"
                  @successCBK="thumbnilSuccessCBK"/>
                <el-button v-if="articleform.thumbnil" icon="el-icon-delete" size="mini" type="danger" @click="articleform.thumbnil=''">删除缩略图</el-button>
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
          <el-form-item
            :rules="[
              { required: true, message: '请输入内容', trigger: ['blur'] },
            ]"
            label="内容"
            prop="content">
            <tinymce id="tinymce" ref="editContent" :height="500" v-model="articleform.content"/>
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
import UploadImg from '@/components/UploadImg'
export default {
  name: 'ArticleEdit',
  components: {
    ContainerFull,
    Tinymce,
    UploadImg
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
        }
      ],
      titleMap: {
        'add': '添加',
        'edit': '编辑'
      },
      articleform: {
        // 'id': '',
        'name': '', // 所属栏目
        'type': 'info', // 文章类型
        'title': '',
        'subtitle': '',
        'url': '', // 外链
        'image': '', // 图片
        'thumbnil': '', // 缩略图
        'tag': '', // 标签
        'sort': 1, // 排序
        'start_time': null,
        'end_time': null,
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
        this.articleform.content = ''
        const { data, success } = await articleService.getArticle(this.articleid)
        if (success) {
          this.loading = false
          this.articleform = data
          this.$refs['editContent'].setContent(data.content)

          // 生成自定义参数
          const _custom_params = this.jsonToArray(data.custom_params)
          const _customLength = _custom_params.length
          if (_customLength > 0) {
            var customArr = _custom_params
            const lastLength = 4 - _customLength
            for (let i = 0; i <= lastLength; i++) {
              customArr.push({
                key: '',
                value: ''
              })
            }
            this.customParameter = customArr // 重置自定义参数
          }
        }
      }
    },
    // 自定义参数转数组
    jsonToArray(str) {
      const obj = str.length > 0 && JSON.parse(str)
      // const result = []
      // for (const key in obj) {
      //   result.push({ key: key, value: obj[key] })
      // }
      // return result
      return Object.keys(obj).map((item, index) => ({ key: item, value: obj[item] }))
    },
    // 数组转自定义参数
    arrayToCustomParams(arr) {
      const customParams = {}
      for (var i = 0, len = arr.length; i < len; i++) {
        const key = arr[i].key
        const value = arr[i].value
        if (key) {
          customParams[key] = value
        }
      }
      return JSON.stringify(customParams)
    },
    // 计算输入数
    descInput(limitValue) {
      var txtVal = this.articleform[limitValue].length
      this.limit[limitValue] = txtVal
    },
    // 图片
    imageSuccessCBK(arr) {
      this.articleform.image = arr[0].url
    },
    // 缩略图
    thumbnilSuccessCBK(arr) {
      this.articleform.thumbnil = arr[0].url
    },
    // 保存
    async handleSave() {
      this.$refs['articleform'].validate((valid) => {
        if (valid) {
          if (this.changestate === 'edit') {
            this._putArticle()
          } else {
            this._addArticle()
          }
        } else {
          return false
        }
      })
    },
    // 更新文章
    async _putArticle() {
      const _data = Object.assign(
        {},
        this.articleform,
        { custom_params: this.arrayToCustomParams(this.customParameter) }
      )
      const { success } = await articleService.putArticle(this.articleid, _data)
      if (success) {
        this.activeName = 'first'
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      }
    },
    // 添加文章
    async _addArticle() {
      const _data = Object.assign(
        {},
        this.articleform,
        { categoryid: this.categoryid },
        { custom_params: this.arrayToCustomParams(this.customParameter) }
      )
      const { success } = await articleService.addArticle(_data)
      if (success) {
        this.loading = false
        this.$message({
          message: '添加文章成功！',
          type: 'success'
        })
        this.$emit('editSuccessCb', this.categoryid)
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
.articleImg{
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  float: left;
}
.tinymce-container .mce-tinymce{
  box-sizing: border-box;
}
</style>
