<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="user-ruleForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username" placeholder="用户名"/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" placeholder="邮箱"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" placeholder="密码"/>
    </el-form-item>
    <el-form-item label="确认密码" prop="repeatPassword">
      <el-input v-model="ruleForm.repeatPassword" type="password" placeholder="确认密码"/>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="ruleForm.mobile" placeholder="手机号码"/>
    </el-form-item>
    <el-form-item label="用户类型" prop="user_type">
      <el-select v-model="ruleForm.user_type" placeholder="请选择用户类型">
        <el-option label="管理员" value="1"/>
        <el-option label="普遍用户" value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
        <el-radio :label="0">保密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用户状态" prop="state">
      <el-radio-group v-model="ruleForm.state">
        <el-radio :label="1">正常</el-radio>
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="2">未认证</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { getUserid, postUser, putUserid } from '@/api/user'
import { regPassword, regPhone } from '@/utils/regrule'
// 初始化表单数据
const initFormData = {
  userid: '', // 用户Id,编辑时用
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
  sex: 1, // 姓别
  mobile: '',
  user_type: '1',
  state: 1
}
export default {
  name: 'AddUser',
  props: {
    edituserid: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!regPassword.test(value)) {
          callback(new Error('密码必须有8位且有一个大写字母和数字'))
        }
        if (this.ruleForm.repeatPassword !== '') {
          this.$refs.ruleForm.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: Object.assign({}, initFormData),
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        // password: [
        //   { required: true, message: '请输入您的密码', trigger: 'blur' },
        //   { pattern: regPassword, message: '密码必须有8位且有一个大写字母和数字' }
        // ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repeatPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        mobile: [
          { pattern: regPhone, message: '请输入正确的手机号' }
        ]
      }
    }
  },
  watch: {
    edituserid() {
      this._initFormData()
    }
  },
  mounted() {
    this._initFormData()
  },
  methods: {
    // 初始化数据
    _initFormData() {
      if (this.edituserid) {
        this.$refs.ruleForm.resetFields()
        this._getEditUser()
      } else {
        this.$refs.ruleForm.resetFields()
        this.ruleForm = initFormData // 重置数据
      }
    },
    async _getEditUser() {
      const { success, data } = await getUserid(this.edituserid)
      if (success) {
        this.ruleForm = Object.assign({}, this.ruleForm, data, { state: parseInt(data.state) })
      }
    },
    // 创建用户
    async _createUser() {
      const {
        // userid,
        username,
        email,
        password,
        sex,
        mobile,
        user_type,
        state
      } = this.ruleForm
      const _data = {
        // userid,
        username,
        email,
        password,
        sex,
        mobile,
        user_type,
        state
      }
      const { success, message } = await postUser(_data)
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.$store.commit('SET_ADDUSER_VISIBLE', false)
      } else {
        this.$message.error(message)
      }
    },
    // 编辑用户
    async _editUser() {
      const {
        userid,
        username,
        email,
        password,
        sex,
        mobile,
        user_type,
        state
      } = this.ruleForm
      const _data = {
        userid,
        username,
        email,
        password,
        sex,
        mobile,
        user_type,
        state
      }
      const { success, message } = await putUserid(userid, _data)
      if (success) {
        this.$message({
          type: 'success',
          message: message
        })
        this.$store.commit('SET_ADDUSER_VISIBLE', false)
      } else {
        this.$message.error(message)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.edituserid) {
            this._editUser()
          } else {
            this._createUser()
          }
          // alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.user-ruleForm{
  width: 400px;
}
</style>
