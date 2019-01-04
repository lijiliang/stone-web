const component = {
  state: {
    isAddUserDialog: false // 是否显示添加或编辑用户信息
  },
  mutations: {
    SET_ADDUSER_VISIBLE: (state, visible) => {
      state.isAddUserDialog = visible
    }
  },
  actions: {
  }
}

export default component
