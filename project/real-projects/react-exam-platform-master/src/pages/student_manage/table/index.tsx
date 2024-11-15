import React, { useEffect } from 'react'
import { Space, Table, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './index.module.scss'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_student_list_data_async, select_student_list_data, select_user_loading, set_is_show_student_edit, set_student_info, set_student_list_data } from '@/store/slice/user'
import dayjs from 'dayjs'
import { get_subject_tree_async } from '@/store/slice/subject'

interface DataType {
  key: string
  name: string
  money: string
  address: string
  tags: string[]
  _id: string
  phone: string
  role: string
  created: string
  edu: string
  techStack: string
}

const PAGE_COUNT = 10

// 学生管理表格
export default function ManageTable() {
  const dispatch = useAppDispatch()
  const studentListData = useAppSelector(select_student_list_data)
  const loading = useAppSelector(select_user_loading)

  // 获取学生列表
  useEffect(() => {
    dispatch(get_student_list_data_async({}))
  }, [])

  // 表格数据处理
  const data: DataType[] = studentListData.list?.map((item: any) => {
    return {
      ...item,
      key: item._id
    }
  })

  // 点击编辑按钮
  const editRole = (item: any) => {
    // 设置选中的学生信息
    dispatch(set_student_info(item))
    // 获取课程的树型结构
    dispatch(get_subject_tree_async())
    // modal框的显示
    dispatch(set_is_show_student_edit(true))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '花名',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: '当前薪资',
      dataIndex: 'money',
      key: 'money'
    },
    {
      title: '技术栈',
      dataIndex: 'techStack',
      key: 'techStack'
    },
    {
      title: '学历',
      dataIndex: 'edu',
      key: 'edu'
    },
    {
      title: '号码',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '课程权限',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: '注册时间',
      dataIndex: 'created',
      key: 'created',
      render: _ => {
        return <>{dayjs(_).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => editRole(record)}>编辑</a>
          <a>删除</a>
        </Space>
      )
    }
  ]

  // 更改页数
  const changePage = (page: number) => {
    dispatch(
      get_student_list_data_async({
        skip: PAGE_COUNT * (page - 1)
      })
    )
    dispatch(set_student_list_data(page))
  }

  return (
    <div className={styles.table}>
      <Table loading={loading} columns={columns} dataSource={data} pagination={false} />
      <Pagination onChange={changePage} current={studentListData.current} total={studentListData.count} style={{ marginTop: 20 }} />
    </div>
  )
}
