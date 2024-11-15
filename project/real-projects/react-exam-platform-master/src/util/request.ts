import axios from './http'
import type { AxiosRes, ResData, AxiosResData } from './http'
import { postSubjectTwoFieldType } from '@/pages/subject_manage/add_subject_two'
import { PersonInfoFieldType } from '@/pages/person_info'

type Role = 'student' | 'admin' | 'super_admin'

// 定义服务端返回的用户信息的类型
export type UserInfo = {
  created: Date // 时间
  name: string // 学生花名
  vChat: string // 微信名字
  phone: string // 手机
  avatar: string // 头像
  graduation_time: Date // 毕业时间
  money: number // 现在薪资
  role: Role // 角色
  _id: string
  has_person_info: boolean // 是否填写个人信息
  topic_role: [] // 课程权限列表
  techStack: string // 技术栈
  edu: string //学历
}

// 定义菜单类型
export type MenuData = {
  hasMenu: boolean
  key: string
  label: string
  path: string
}

// 定义阅卷列表类型
export type ExamList = {
  _id: string
  topic_list: []
  two_id: string
  user_id: string
  is_judge: boolean
  created: string
  user_name: string
  subject_name: string
}

// 定义题目的类型
export type TopicData = {
  _id: string
  title: string
  dec: string
  two_id: string
  created: string
  img: string[]
}

// 定义课程树型结构
export type SubjectTreeType = {
  title: string
  value: string
  can_exam?: boolean
  children: SubjectTreeType[]
}

// 定义每个考试题目的类型
export type ExamTopicType = {
  created: Date
  is_judge: boolean
  subject_name: string
  topic_list: ExamTopicListDateType[]
  two_id: string
  user_id: string
  user_name: string
  _id: string
}

// 点击阅卷时考题列表中每个题目
export type ExamTopicListDateType = {
  _id: string
  title: string
  dec: string
  two_id: string
  creatd: string
  answer: string
  comment: string
  pass: boolean
  is_corret: boolean
}

// 登录
type LoginBody = {
  phone: string
  code: string
}
export async function LoginPost(body: LoginBody) {
  return new Promise<UserInfo>(async (resolve, reject) => {
    const res: AxiosResData<UserInfo> = await axios.post('/api/user/login', body)
    resolve(res.data.data)
  })
}

// 退出登录
export function LogoutPost() {
  return new Promise(async (reslove, reject) => {
    const res: AxiosResData = await axios.post('/api/user/logout')
    reslove(res.data.data)
  })
}

// 获取菜单
export function getMenuRequest() {
  return new Promise<MenuData[]>(async (resolve, reject) => {
    const res: AxiosResData<MenuData[]> = await axios.get('/api/user/menu')
    resolve(res.data.data)
  })
}

// 获取用户信息
export function getUserInfoRequest() {
  return new Promise<UserInfo>(async (resolve, reject) => {
    const res = await axios.get('/api/user')
    resolve(res.data.data)
  })
}

// 获取阅卷列表
export function postExamList(body: any) {
  return new Promise<ExamList[]>(async (resolve, reject) => {
    const res: AxiosRes<ExamList[]> = await axios.post('/api/exam', body)
    resolve(res.data)
  })
}

// 获取课程的树型结构
export function getSubjectTree() {
  return new Promise<SubjectTreeType[]>(async (reslove, reject) => {
    //@ts-ignore
    const res: AxiosResData<SubjectTreeType[]> = await axios.get('/api/subject', { cache: true })
    reslove(res.data.data)
  })
}

// 根据二级课程id查询题目
export function getTopic(s2id: string) {
  return new Promise<TopicData[]>(async (resolve, reject) => {
    const res: AxiosResData<TopicData[]> = await axios.get(`/api/topic/${s2id}`)
    resolve(res.data.data)
  })
}

// 删除二级课程
export function deleteSubjectTwo(id: string) {
  return new Promise(async (resolve, reject) => {
    const res = await axios.delete(`/api/subject/two/${id}`)
    resolve(res)
  })
}

// 获取一级课程
export type SubjectType = {
  name: string
  key: string
}
export function getSubjectOne() {
  return new Promise<SubjectType[]>(async (resolve, reject) => {
    const res: AxiosResData<SubjectType[]> = await axios.get('/api/subject/one')
    resolve(res.data.data)
  })
}

// 新增二级课程
export function postSubjectTwo(body: postSubjectTwoFieldType) {
  return new Promise(async (resolve, reject) => {
    const res = await axios.post('/api/subject/two', body)
    resolve(res)
  })
}

// 获取学生列表
export function getStudentList(params: any) {
  return new Promise<ResData<UserInfo[]>>(async (resolve, reject) => {
    const res: AxiosResData<UserInfo[]> = await axios.get('/api/user/student', {
      params
    })
    resolve(res.data)
  })
}

// 学生权限的修改
export function patchStudentRole(user_id: string, role: []) {
  return new Promise(async (resolve, reject) => {
    const res = await axios.patch(`/api/user/${user_id}`, {
      topic_role: role
    })
    resolve(res)
  })
}

// 修改或者填写个人信息
export function patchPersonInfo(user_id: string, params: PersonInfoFieldType) {
  return new Promise<AxiosResData<any>>(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.patch(`/api/user/${user_id}`, { ...params })
    resolve(res)
  })
}

// 根据考试ID获取考试列表
export function getExamTopicListById(id: string) {
  return new Promise<ExamTopicType>(async (resolve, reject) => {
    const res: AxiosResData<ExamTopicType> = await axios.get(`/api/exam/${id}`)
    resolve(res.data.data)
  })
}

// 管理员批阅试卷
export function patchExam(exam_id: string, body: any) {
  return new Promise<AxiosResData<any>>(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.patch(`/api/exam/${exam_id}`, body)
    resolve(res)
  })
}

// 获取管理员列表
export function getAdminList() {
  return new Promise<UserInfo[]>(async (resolve, reject) => {
    const res: AxiosResData<UserInfo[]> = await axios.get('/api/user/admin')
    resolve(res.data.data)
  })
}

// 新增管理员
export function postAddAdmin(phone: string) {
  return new Promise(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.post(`/api/user/add_admin`, { phone })
    resolve(res)
  })
}

// 获取试卷题目
export function getExamTopic(subject_two_id: string) {
  return new Promise<ExamTopicListDateType[]>(async (resolve, reject) => {
    const res: AxiosResData<ExamTopicListDateType[]> = await axios.get(`/api/topic/${subject_two_id}`)
    resolve(res.data.data)
  })
}

// 提交试卷
export function postStudentExam(body: { topic_list: ExamTopicListDateType[]; two_id: string }) {
  return new Promise<AxiosResData<any>>(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.post('/api/exam/create', body)
    resolve(res)
  })
}

// 新增题目
export function postTopic(body: any) {
  return new Promise<AxiosResData<any>>(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.post(`/api/topic`, body)
    resolve(res)
  })
}

// 修改题目
export function patchTopic(id: string, body: any) {
  return new Promise<AxiosResData<any>>(async (resolve, reject) => {
    const res: AxiosResData<any> = await axios.patch(`/api/topic/${id}`, body)
    resolve(res)
  })
}
