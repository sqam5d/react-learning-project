import React, { useEffect } from 'react'
import { Button, Table, Tag, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './index.module.scss'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_exam_list_async, select_exam_list_data, select_subject_loading, set_current_exam_topic_id, set_exam_list_data } from '@/store/slice/subject'
import dayjs from 'dayjs'
import Search from './search'
import type { PaginationProps } from 'antd'
import { useNavigate } from 'react-router-dom'

interface DataType {
  key: string
  subject_name: string
  user_name: number
  created: string
  is_judge: boolean
  // tags: string[]
}

const PAGE_COUNT = 10

// 阅卷列表
export default function CorretExamList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // 获取当前的试卷列表
  const exam_list_data = useAppSelector(select_exam_list_data)
  const loading = useAppSelector(select_subject_loading)

  useEffect(() => {
    dispatch(
      get_exam_list_async({
        skip: 10 * (exam_list_data.current_page - 1)
      })
    )
  }, [])

  // 表格的每一列的数据
  const columns: ColumnsType<DataType> = [
    {
      title: '试卷名称',
      dataIndex: 'subject_name',
      key: 'subject_name'
      // render: text => <a>{text}</a>
    },
    {
      title: '学生姓名',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '考试时间',
      dataIndex: 'created',
      key: 'created',
      render: text => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: '是否阅卷',
      key: 'is_judge',
      dataIndex: 'is_judge',
      render: text => {
        // 根据is_judge来判断是否阅卷
        return <>{text ? <Tag color="success">已阅卷</Tag> : <Tag color="default">未阅卷</Tag>}</>
      }
    },
    {
      title: '操作',
      key: '_id',
      dataIndex: '_id',
      render: (text, record) => (
        <>
          {record.is_judge ? (
            <Button type="primary" onClick={() => goReadExam(record)}>
              查看
            </Button>
          ) : (
            <Button danger type="primary" onClick={() => goCorretExam(record)}>
              阅卷
            </Button>
          )}
        </>
      )
    }
  ]

  // 处理过后的表格数据
  const exam = exam_list_data.list?.map((item: any) => {
    return {
      ...item,
      key: item._id
    }
  })

  // 前往查看试卷
  function goReadExam(item: any) {
    navigate(`/read_exam/${item._id}`)
  }

  // 前往阅卷
  function goCorretExam(record: any) {
    // 采用此方式刷新后就会导致数据消失
    // dispatch(set_current_exam_topic_id(record._id))
    // 通过 路由传过去可以防止刷新数据消失
    navigate(`/corret_exam/${record._id}`)
  }

  // 页面数改变
  const changPage: PaginationProps['onChange'] = pageNumber => {
    // 修改页码
    dispatch(
      set_exam_list_data({
        current_page: pageNumber
      })
    )
    // 根据跳跃页面数和搜索参数请求后端数据  因为搜索页的发送的请求只能停留当前页面,切换页面就会失效
    dispatch(
      get_exam_list_async({
        ...exam_list_data.search_params,
        skip: PAGE_COUNT * (pageNumber - 1)
      })
    )
  }

  return (
    <div>
      <div className={styles.search}>
        <Search></Search>
      </div>
      <div className={styles.table}>
        <Table loading={loading} columns={columns} dataSource={exam} pagination={false} />
        <Pagination pageSize={PAGE_COUNT} current={exam_list_data.current_page} total={exam_list_data.count} onChange={changPage} style={{ marginTop: 20 }} />;
      </div>
    </div>
  )
}
