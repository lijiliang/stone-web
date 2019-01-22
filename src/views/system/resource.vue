<template>
  <container-full>
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
      <!-- <el-button
        v-permission="['p_menu_edit']"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="batchEdit"
      >批量编辑</el-button> -->
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

    <el-row>
      <el-col
        :span="8"
        style="margin-top:15px;"
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
        :span="16"
        style="margin-top:15px;"
      >
        <el-card shadow="always">
          <el-form
            ref="menuform"
            :model="menuform"
            label-position="right"
            label-width="100px"
          >
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
              label="标题"
              prop="title"
            >
              <el-input
                v-model="menuform.title"
                :disabled="!formEdit"
                placeholder="请输入标题"
              />
            </el-form-item>
            <el-form-item
              label="name"
              prop="name"
            >
              <el-input
                v-model="menuform.name"
                :disabled="!formEdit"
                placeholder="请输入name"
              />
            </el-form-item>
            <el-form-item
              label="路径"
              prop="path"
            >
              <el-input
                v-model="menuform.path"
                :disabled="!formEdit"
                placeholder="请输入路径"
              />
            </el-form-item>
            <el-form-item
              label="图标"
              prop="icon"
            >
              <el-input
                v-model="menuform.icon"
                :disabled="!formEdit"
                placeholder="请输入图标名"
              />
            </el-form-item>
            <el-form-item
              label="权限标识"
              prop="permission"
            >
              <el-input
                v-model="menuform.permission"
                :disabled="!formEdit"
                placeholder="请输入权限标识"
              />
            </el-form-item>
            <el-form-item
              label="组件"
              prop="component"
            >
              <el-input
                v-model="menuform.component"
                :disabled="!formEdit"
                placeholder="请输入组件"
              />
            </el-form-item>
            <!-- <el-form-item
              label="组件路径"
              prop="componentPath"
            >
              <el-input
                v-model="menuform.componentPath"
                :disabled="!formEdit"
                placeholder="请输入组件路径"
              />
            </el-form-item> -->
            <el-form-item
              label="重定向路径"
              prop="redirect"
            >
              <el-input
                v-model="menuform.redirect"
                :disabled="!formEdit"
                placeholder="请输入重定向路径"
              />
            </el-form-item>
            <el-form-item
              label="排序"
              prop="sort"
            >
              <el-input
                v-model="menuform.sort"
                :disabled="!formEdit"
                placeholder="请输入排序"
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
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.velue"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="锁定"
              prop="isLock"
            >
              <el-switch
                v-model="menuform.isLock"
                :disabled="!formEdit"
              />
            </el-form-item> -->
            <el-form-item label="keep-alive" prop="cache">
              <el-switch v-model="menuform.cache" :disabled="!formEdit"/>
            </el-form-item>
            <el-form-item v-if="formEdit">
              <el-button
                type="primary"
                @click="handleSubmit"
              >提交</el-button>
              <el-button @click="handleReset">清空</el-button>
              <!-- <el-button
                v-if="menuform.id&&menuform.type==2"
                @click="openInterfaceDialog"
              >关联接口</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
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
import * as resourceService from '@/api/permissions/resource'
export default {
  name: 'ResourcePage',
  components: {
    ContainerFull
  },
  data() {
    return {
      formEdit: false,
      currentId: 0,
      menuList: [],
      defaultProps: {
        label: 'title'
      },
      menuform: {
        id: '',
        pid: 0,
        name: '',
        title: '',
        path: '',
        icon: '',
        permission: '',
        component: '',
        componentPath: '',
        sort: 0,
        type: 1,
        isLock: false,
        cache: false,
        redirect: '' // 重定向
      },
      typeOptions: [
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '功能'
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
      const { success, data } = await resourceService.getResourceList()
      if (success) {
        this.menuList = data
      }
    },
    async getMenuData(_data) {
      const id = _data.id
      const { success, data } = await resourceService.getResource(id)
      if (success) {
        this.menuform = {
          id: data.id,
          pid: data.pid,
          name: data.name,
          title: data.title,
          path: data.path,
          icon: data.icon,
          permission: data.permission,
          component: data.component,
          componentPath: data.componentPath,
          sort: data.sort,
          type: data.type,
          isLock: data.isLock,
          cache: data.cache,
          redirect: data.redirect
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
        // const { success, data } = await resourceService.delResource(this.currentId)
        // if (success) {
        //   console.log(data)
        //   this.currentId = 0
        //   this.getMenuList()
        // }
        resourceService.delResource(this.currentId).then(() => {
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
    // 提交
    async handleSubmit() {
      const { success, message } = await resourceService.addResource(this.menuform)
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
        name: '',
        title: '',
        path: '',
        icon: '',
        permission: '',
        component: '',
        componentPath: '',
        sort: 0,
        type: 1,
        isLock: false,
        cache: false,
        redirect: ''
      }
    },
    batchEdit() {

    }
  }

}
</script>

<style scoped>

</style>
