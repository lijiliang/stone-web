<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
    <el-tag>{{ role.name }}</el-tag>权限</div>
    <el-input v-model="filterText" size="mini" placeholder="输入关键字进行过滤" style="padding-bottom: 5px;"/>
    <el-tree
      ref="tree"
      :props="{label: 'title'}"
      :data="permissionList"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      show-checkbox
      check-on-click-node
      default-expand-all
      highlight-current
      node-key="id">
      <span slot-scope="{ node, data }">
        <i v-if="data.type==2" class="fa fa-cog"/>&nbsp;{{ node.label }}
      </span>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="saveRolePermission">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>

</template>
<script>
import * as roleService from '@/api/permissions/role'
import * as resourceService from '@/api/permissions/resource'
export default {
  name: 'RolePermission',
  props: {
    role: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      filterText: '',
      permissionList: []
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    async dialogOpen() {
      const { success, data } = await resourceService.getResourceList()
      if (success) {
        this.permissionList = data
      }
      // this.permissionList = await resourceService.getResourceList()
      const rolePermissions = await roleService.getRolePermissions(this.role.id) || {}
      let rolePermissionList = []
      if (rolePermissions.success) {
        rolePermissionList = rolePermissions && rolePermissions.data.resource_id_fe.split(',')
      }
      this.$refs.tree.setCheckedKeys(rolePermissionList)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    saveRolePermission() {
      const checkedNodesids = this.$refs.tree.getCheckedKeys(false, true) // 如果子级没有全选，不能选中父级id
      const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const checkedPermissins = []
      for (const checked of checkedNodes) {
        // checked.type === 2 && checkedPermissins.push(checked.id)
        checkedPermissins.push(checked.id)
      }
      const data = {
        role_id: this.role.id,
        // resource_id: checkedNodes
        resource_id: checkedPermissins,
        resource_id_fe: checkedNodesids // 前端专用,如子级没有全选中，则不会会有父级id
      }
      this.loading = true
      roleService.savePermission(data).then(data => {
        this.loading = false
        this.dialogVisible = false
      })
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>

