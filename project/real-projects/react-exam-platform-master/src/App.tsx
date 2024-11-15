import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useRoutes } from 'react-router-dom'
import './App.scss'
import Layout from './common_components/layout'
import { RouterData } from '@/config'
import CorretExamList from './pages/corret_exam_list'
// import SubjectAdd from './pages/subject_add'
// import SubjectManage from './pages/subject_manage'
import StudentManage from './pages/student_manage'
import Login from './pages/login'
import ExamSelect from './pages/exam_select'
import ExamHistory from './pages/exam_history'
import AdminManage from './pages/admin_manage'
import PersonInfo from './pages/person_info'
import { useAppDispatch, useAppSelector } from './store'
import { get_menu_async, get_user_info_async, select_menu, select_user_info } from './store/slice/user'
import ReadExam from './pages/read_exam'
import CorretExam from './pages/correc_exam'
import Exam from './pages/exam'
import eventBus from './util/event'
import { notification } from 'antd'
import { LogoutPost, MenuData, UserInfo } from './util/request'
import useRenderCount from './hooks/useRenderCount'
import Cookies from 'js-cookie'
import { usePathKey } from './hooks/usePathKey'
import NotFound from './pages/404/NotFound'

// 懒加载
const AsyncSubjectAdd = lazy(() => import('./pages/subject_add'))
const AsyncSubjectManage = lazy(() => import('./pages/subject_manage'))
// Suspense与lazy配合shiyong
function SubjectManage() {
  return (
    <Suspense fallback={'loading'}>
      <AsyncSubjectManage></AsyncSubjectManage>
    </Suspense>
  )
}

function SubjectAdd() {
  return (
    <Suspense fallback={'loading'}>
      <AsyncSubjectAdd></AsyncSubjectAdd>
    </Suspense>
  )
}

// 处理错误的函数
const openNotification = (msg: string) => {
  notification.error({
    message: '错误',
    description: `错误信息：${msg}`
  })
}

const component: any = {
  '/': <Navigate to={'/login'}></Navigate>,
  login: <Login></Login>,
  person_info: <PersonInfo></PersonInfo>,
  corret_exam_list: <CorretExamList></CorretExamList>,
  subject_add: <SubjectAdd></SubjectAdd>,
  subject_manage: <SubjectManage></SubjectManage>,
  student_manage: <StudentManage></StudentManage>,
  exam_select: <ExamSelect></ExamSelect>,
  exam_history: <ExamHistory></ExamHistory>,
  admin_manage: <AdminManage></AdminManage>,
  read_exam: <ReadExam></ReadExam>,
  corret_exam: <CorretExam></CorretExam>,
  exam: <Exam></Exam>
}
// APP组件
function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // 用户信息
  const user_info = useAppSelector(select_user_info)
  // const menu = useAppSelector(select_menu)
  // 路径参数
  const pathKey = usePathKey()

  // 统计APP渲染次数
  useRenderCount('App')

  // 获取用户信息
  useEffect(() => {
    dispatch(get_user_info_async())
    // if (pathKey !== 'login') {
    //   // 获取用户信息\
    //   dispatch(get_menu_async())
    // }

    // 未登录
    eventBus.on('global_not_login', function (msg) {
      navigate('/login')
    })

    // 没有权限
    eventBus.on('global_error_auth', function (msg) {
      openNotification(msg)

      LogoutPost().then(() => {
        navigate('/login')
      })
    })

    // 业务错误
    eventBus.on('global_error_tips', function (msg) {
      openNotification(msg)
    })
  }, [])

  // 如果存在登录状态要去登录页则返回
  // if (pathKey === 'login' && Object.keys(user_info).length > 0) {
  //   navigate(-1)
  // }

  // 静态路由
  const commonRoute = [
    {
      path: '/',
      element: component['/']
    },
    {
      path: '/login',
      element: component.login
    },
    {
      element: <Layout></Layout>,
      children: [
        {
          path: '/person_info',
          element: component.person_info
        },
        // 因为后端没返回
        {
          path: '/exam/:subject_two_id',
          element: component.exam
        },
        {
          path: '/read_exam/:exam_id',
          element: component.read_exam
        },
        {
          path: '/corret_exam/:exam_id',
          element: component.corret_exam
        }
      ]
    }
  ]
  // 应该使用深拷贝
  const allRoute = [...commonRoute]

  // 如果不是登录页,获取动态路由
  if (pathKey !== 'login') {
    let menu = JSON.parse(localStorage.getItem('menu')!)
    // 动态路由
    menu?.forEach((item: MenuData) => {
      allRoute.at(-1)?.children?.push({ path: item.path, element: component[item.key] })
    })

    // 添加任意路由
    allRoute.push({
      path: '*',
      element: <NotFound></NotFound>
    })
  }

  let route = useRoutes(allRoute)

  return (
    <>{route}</>

    // <Routes>
    //   <Route path="/" element={<Navigate to={'/login'}></Navigate>}></Route>

    //   <Route path={RouterData.login.path} element={<Login></Login>}></Route>

    //   <Route element={<Layout></Layout>}>
    //     {/* 静态路由 */}
    //     <Route path={RouterData.person_info.path} element={<PersonInfo></PersonInfo>}></Route>
    //     {/* 动态路由 */}

    //     <Route path={RouterData.corret_exam_list.path} element={<CorretExamList></CorretExamList>}></Route>
    //     <Route path={RouterData.subject_add.path} element={<SubjectAdd></SubjectAdd>}></Route>
    //     <Route path={RouterData.subject_manage.path} element={<SubjectManage></SubjectManage>}></Route>
    //     <Route path={RouterData.student_manage.path} element={<StudentManage></StudentManage>}></Route>
    //     <Route path={RouterData.exam_select.path} element={<ExamSelect></ExamSelect>}></Route>
    //     <Route path={RouterData.exam_history.path} element={<ExamHistory></ExamHistory>}></Route>
    //     <Route path={RouterData.admin_manage.path} element={<AdminManage></AdminManage>}></Route>
    //     <Route path={RouterData.read_exam.path} element={<ReadExam></ReadExam>}></Route>
    //     <Route path={RouterData.corret_exam.path} element={<CorretExam></CorretExam>}></Route>
    //     <Route path={RouterData.exam.path} element={<Exam></Exam>}></Route>
    //   </Route>
    // </Routes>
  )
}

export default App
