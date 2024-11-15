type RouterDataType = typeof RouterData
export type RouterKeys = keyof RouterDataType

// 路由信息
export const RouterData = {
  // 登录
  login: {
    path: '/login'
  },
  // 单词应该为correct 阅卷列表
  corret_exam_list: {
    path: '/corret_exam_list'
  },
  // 考题管理
  subject_add: {
    path: '/subject_add'
  },
  // 课程管理
  subject_manage: {
    path: '/subject_manage'
  },
  // 学员管理
  student_manage: {
    path: '/student_manage'
  },
  // 考题选择
  exam_select: {
    path: '/exam_select'
  },
  // 考试记录
  exam_history: {
    path: '/exam_history'
  },
  // 管理员管理
  admin_manage: {
    path: '/admin_manage'
  },
  // 个人中心
  person_info: {
    path: '/person_info'
  },
  // 查看试卷
  read_exam: {
    path: '/read_exam/:exam_id'
  },
  // 阅卷
  corret_exam: {
    path: '/corret_exam/:exam_id'
  },
  // 考试
  exam: {
    path: '/exam/:subject_two_id'
  }
}
