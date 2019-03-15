<template>
  <container-full class="category-container">
    <el-row type="flex" class="h-full">
      <el-col
        :span="8"
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
          style="padding-right: 10px;"
          @node-click="getMenuData"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              {{ data.code }}
            </span>
            <span>
              {{ data.type === 'channel' ? '栏目' : data.type === 'page' ? "单页" : '外链' }}
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col
        :span="16"
      >
        <container-full :has-relative="true">
          <template slot="header">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="add"
              >添加</el-button>
              <el-button
                :disabled="!currentId"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="edit"
              >编辑</el-button>
              <el-button
                :disabled="!currentId"
                type="primary"
                icon="el-icon-delete"
                size="mini"
                @click="del"
              >删除</el-button>
              <el-button
                :disabled="!currentId"
                type="primary"
                icon="el-icon-circle-close-outline"
                size="mini"
                @click="cancel"
              >取消</el-button>
            </el-button-group>
            <el-popover
              placement="top-start"
              title="温馨提示"
              width="400"
              trigger="hover"
            >
              <li>请不要在`功能`类型节点下建子节点</li>
              <li>`菜单`类型节点的权限标识请设置为其某个`功能`类型子节点的权限标识</li>
              <el-button
                slot="reference"
                size="mini"
                icon="el-icon-info"
                style="float:right"
              >操作提示</el-button>
            </el-popover>
          </template>
          <el-form
            ref="menuform"
            :model="menuform"
            label-position="right"
            label-width="100px"
          >
            <el-row :gutter="10">
              <el-col :span="12"><div class="grid-content bg-purple"/>
                <el-form-item
                  label="父级节点"
                  prop="pid"
                >
                  <el-input
                    v-model="menuform.pid"
                    :disabled="true"
                    placeholder="父级节点"
                  />
                </el-form-item>
                <el-form-item
                  label="栏目名称"
                  prop="name"
                >
                  <el-input
                    v-model="menuform.name"
                    :disabled="!formEdit"
                    placeholder="请输入栏目名称"
                  />
                </el-form-item>
                <el-form-item
                  label="英文栏目名称"
                  prop="en_name"
                >
                  <el-input
                    v-model="menuform.en_name"
                    :disabled="!formEdit"
                    placeholder="请输入英文栏目名称"
                  />
                </el-form-item>
                <el-form-item
                  label="编码"
                  prop="code"
                >
                  <el-input
                    v-model="menuform.code"
                    :disabled="!formEdit"
                    placeholder="请输入编码"
                  />
                </el-form-item>
                <el-form-item
                  label="路由"
                  prop="route"
                >
                  <el-input
                    v-model="menuform.route"
                    :disabled="!formEdit"
                    placeholder="请输入路由"
                  />
                </el-form-item>
                <el-form-item
                  label="类型"
                  prop="type"
                >
                  <el-select
                    v-model="menuform.type"
                    :disabled="!formEdit"
                    class="filter-item"
                    placeholder="请选择类型"
                    style="width: 100%"
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
                  label="外链"
                  prop="url"
                >
                  <el-input
                    v-model="menuform.url"
                    :disabled="menuform.type!=='link'"
                    placeholder="请输入外链(类型为外链需要填写)"
                  />
                </el-form-item>
                <el-form-item
                  label="栏目图片"
                  prop="image"
                >
                  <!-- <el-input
                    v-model="menuform.image"
                    :disabled="!formEdit"
                    placeholder="请输入栏目图"
                  /> -->
                  <img v-if="menuform.image" :src="menuform.image" class="articleImg">
                  <UploadImg
                    :disabled="!formEdit"
                    :limit="1"
                    button-text="上传图片"
                    @successCBK="imageSuccessCBK"/>
                  <el-button v-if="menuform.image" :disabled="!formEdit" icon="el-icon-delete" size="mini" type="danger" @click="menuform.image=''">删除图片</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12"><div class="grid-content bg-purple"/>
                <!-- <el-form-item
                  label="描述"
                  prop="description"
                >
                  <el-input
                    :rows="2"
                    v-model="menuform.description"
                    :disabled="!formEdit"
                    type="textarea"
                    placeholder="请输入描述"
                  />
                </el-form-item> -->
                <el-form-item
                  label="seo标题"
                  prop="meta_title"
                >
                  <el-input
                    :rows="2"
                    v-model="menuform.meta_title"
                    :disabled="!formEdit"
                    type="textarea"
                    placeholder="请输入seo标题"
                  />
                </el-form-item>
                <el-form-item
                  label="seo关键字"
                  prop="meta_keywords"
                >
                  <el-input
                    :rows="2"
                    v-model="menuform.meta_keywords"
                    :disabled="!formEdit"
                    type="textarea"
                    placeholder="请输入seo关键字"
                  />
                </el-form-item>
                <el-form-item
                  label="seo描述"
                  prop="meta_description"
                >
                  <el-input
                    :rows="2"
                    v-model="menuform.meta_description"
                    :disabled="!formEdit"
                    type="textarea"
                    placeholder="请输入seo描述"
                  />
                </el-form-item>
                <el-form-item
                  label="排序"
                  prop="sort"
                >
                  <el-input-number v-model="menuform.sort" :disabled="!formEdit" :min="0" :max="1000" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否启用" prop="enable">
                  <el-switch v-model="menuform.enable" :disabled="!formEdit"/>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-form-item v-if="formEdit">
                <el-button
                  type="primary"
                  @click="handleSubmit"
                >提交</el-button>
                <el-button @click="handleReset">清空</el-button> -->
            <!-- <el-button
                v-if="menuform.id&&menuform.type==2"
                @click="openInterfaceDialog"
              >关联接口</el-button> -->
            <!-- </el-form-item> -->
          </el-form>
          <template slot="footer">
            <el-button
              v-if="formEdit"
              type="primary"
              @click="handleSubmit"
            >提交</el-button>
            <el-button v-if="formEdit" @click="handleReset">清空</el-button>
          </template>
        </container-full>
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
import UploadImg from '@/components/UploadImg'
export default {
  name: 'CategoryPage',
  components: {
    ContainerFull,
    UploadImg
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
      editFormDialogVisible: false,
      relateInterfaceDialogVisible: false
      // canAdd: this.hasPermissions(['p_menu_edit'])
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { success, data } = await categoryService.getCategoryList()
      if (success) {
        this.menuList = data
      }
    },
    async getMenuData(_data) {
      const id = _data.id
      const { success, data } = await categoryService.getCategory(id)
      if (success) {
        this.menuform = {
          id: data.id,
          pid: data.pid,
          name: data.name, // 栏目名称
          en_name: data.en_name, // 英文栏目名称
          code: data.code, // 编码
          route: data.route, // 路由
          type: data.type, // 类型
          url: data.url, // 外链
          image: data.image, // 栏目图
          description: data.description, // 描述
          meta_title: data.meta_title, // seo标题
          meta_keywords: data.meta_keywords, // seo关键词
          meta_description: data.meta_description, // seo描述
          sort: data.sort, // 排序
          enable: data.enable // 是否启用
        }
        this.currentId = id
      }
    },
    add() {
      this.menuform = {
        id: 0,
        pid: this.currentId
      }
      this.formEdit = true
    },
    edit() {
      this.formEdit = true
    },
    async del() {
      this.$confirm('确认删除？', '确认信息', {
        // distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        // const { success, data } = await categoryService.delCategory(this.currentId)
        // if (success) {
        //   console.log(data)
        //   this.currentId = 0
        //   this.getMenuList()
        // }
        categoryService.delCategory(this.currentId).then(() => {
          this.currentId = 0
          this.getMenuList()
        })
      })
    },
    // 取消
    cancel() {
      this.formEdit = false
      this.currentId = 0
      this.menuform = {}
    },
    // 图片
    imageSuccessCBK(arr) {
      this.menuform.image = arr[0].url
    },
    // 提交
    async handleSubmit() {
      const { success, message } = await categoryService.addCategory(this.menuform)
      if (success) {
        this.$message({
          message: message,
          type: 'success'
        })
        this.getMenuList()
      }
    },
    handleReset() {
      this.menuform = {
        id: this.currentId,
        pid: this.menuform.pid,
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
      }
    },
    batchEdit() {

    }
  }

}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

<style lang="scss">
.category-container {
  .container-full__body{
    padding: 0;
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
</style>
