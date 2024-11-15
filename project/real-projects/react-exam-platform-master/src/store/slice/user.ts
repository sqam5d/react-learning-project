import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../index'
import { UserInfo, getMenuRequest, MenuData, getUserInfoRequest, getStudentList, getAdminList } from '@/util/request'

type Data = {
  loading: boolean
  user_info: UserInfo
  menu: MenuData[]
  student_list_data: {
    list: UserInfo[]
    count: number
    current: number
  }
  is_show_student_edit: boolean
  student_info: UserInfo
  admin_list: UserInfo[]
}

// 仓库的初始值
const initialState: Data = {
  loading: false,
  user_info: {} as UserInfo,
  menu: [],
  // 学生列表
  student_list_data: {
    list: [],
    count: 0,
    current: 1
  },
  is_show_student_edit: false,
  student_info: {} as UserInfo,
  // 管理员列表
  admin_list: []
}

// 获取菜单
export const get_menu_async = createAsyncThunk<MenuData[]>('get/user_menu', async (action, state) => {
  return await getMenuRequest()
})

// 获取用户信息
export const get_user_info_async = createAsyncThunk<UserInfo>('get/user_info', async (action, state) => {
  return await getUserInfoRequest()
})

// 获取学生列表
export const get_student_list_data_async = createAsyncThunk<any, any>('get/student_list_data', async (action, state) => {
  return await getStudentList(action)
})

// 获取管理员列表
export const get_admin_list_async = createAsyncThunk<UserInfo[]>('get/admin_list', async (action, state) => {
  return await getAdminList()
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    set_user_info: (state, action) => {
      state.user_info = action.payload
    },
    // 设置学生管理编辑框的显示
    set_is_show_student_edit: (state, action) => {
      state.is_show_student_edit = action.payload
    },
    // 设置学生管理中点击编辑该学生的信息
    set_student_info: (state, action) => {
      state.student_info = action.payload
    },
    // 设置学生管理当前所在的页数
    set_student_list_data: (state, action) => {
      state.student_list_data.current = action.payload
    }
  },
  extraReducers: builder => {
    builder
      // 获取菜单
      .addCase(get_menu_async.fulfilled, (state, res) => {
        // 持久化存储菜单
        localStorage.setItem('menu', JSON.stringify(res.payload))

        console.log('store')
        state.menu = res.payload
      })
      // 获取用户信息，防止刷新丢失
      .addCase(get_user_info_async.fulfilled, (state, res) => {
        state.user_info = res.payload || {}
      })
      .addCase(get_student_list_data_async.pending, (state, res) => {
        state.loading = true
      })
      // 获取学生列表
      .addCase(get_student_list_data_async.fulfilled, (state, res) => {
        state.loading = false
        state.student_list_data.count = res.payload.count
        state.student_list_data.list = res.payload.data
      })
      // 获取管理员列表
      .addCase(get_admin_list_async.fulfilled, (state, res) => {
        state.admin_list = res.payload
      })
  }
})

//查询用户信息
export const select_user_info = (state: RootState) => {
  return state.user.user_info
}

// 查询菜单
export const select_menu = (state: RootState) => {
  return state.user.menu
}

// 查询学生列表
export const select_student_list_data = (state: RootState) => {
  return state.user.student_list_data
}

// 查询加载状态
export const select_user_loading = (state: RootState) => {
  return state.user.loading
}

// 查询学生管理的编辑按钮的显示
export const select_is_show_student_edit = (state: RootState) => {
  return state.user.is_show_student_edit
}

// 查询学生管理中点击编辑该学生的信息
export const select_student_info = (state: RootState) => {
  return state.user.student_info
}

// 查询管理员列表
export const select_admin_list = (state: RootState) => {
  return state.user.admin_list
}

export const { set_user_info, set_is_show_student_edit, set_student_info, set_student_list_data } = userSlice.actions

export default userSlice.reducer
