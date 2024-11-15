import React, { useEffect } from 'react'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_exam_list_async, select_exam_list_data } from '@/store/slice/subject'
import { SubjectTreeType } from '@/util/request'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

interface DataType {
  key: string
  subject_name: string
  created: number
  is_judge: string
}

// 考试历史记录
export default function ExamHistory() {
  const dispatch = useAppDispatch()
  const exam_history = useAppSelector(select_exam_list_data)
  const navigate = useNavigate()

  // 获取自己考试的列表
  useEffect(() => {
    dispatch(get_exam_list_async({}))
  }, [])

  // 对每一个考试记录进行添加key
  function addKeyForExamHistory(exam_history: any) {
    let copy = JSON.parse(JSON.stringify(exam_history))

    copy.forEach((item: any) => {
      item.key = item._id
    })

    return copy
  }

  // 查看试卷
  const seeExam = (item: any) => {
    navigate(`/read_exam/${item._id}`)
  }

  // 表格数据
  const columns: ColumnsType<DataType> = [
    {
      title: '试卷名称',
      dataIndex: 'subject_name',
      key: 'subject_name',
      render: text => <a>{text}</a>
    },
    {
      title: '考试时间',
      dataIndex: 'created',
      key: 'created',
      render: text => {
        return <>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    },
    {
      title: '是否阅卷',
      dataIndex: 'is_judge',
      key: 'is_judge',
      render: text => {
        return <>{text ? <Tag color="green">已阅卷</Tag> : <Tag color="gray">未阅卷</Tag>}</>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            {record.is_judge ? (
              <Button onClick={() => seeExam(record)} size="small" type="primary" ghost>
                查看
              </Button>
            ) : (
              <Button disabled size="small" type="primary" ghost>
                查看
              </Button>
            )}
          </>
        )
      }
    }
  ]

  const data: DataType[] = addKeyForExamHistory(exam_history.list)

  return (
    <div style={{ marginTop: 20 }}>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
