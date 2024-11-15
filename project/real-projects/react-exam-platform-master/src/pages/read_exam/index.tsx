import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { Tag } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { useParams } from 'react-router-dom'
import { get_exam_topic_list_async, select_exam_topic_list } from '@/store/slice/subject'
import ExamDetail from '@/common_components/exam_detail'

// 查看试卷
export default function ReadExam() {
  const dispatch = useAppDispatch()
  const params = useParams()
  // 获取路由跳转过来携带的试卷id参数
  const exam_id = params.exam_id as string

  // 获取考试题目的列表
  const exam_topic_list = useAppSelector(select_exam_topic_list)

  useEffect(() => {
    dispatch(get_exam_topic_list_async(exam_id))
  }, [exam_id])

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.title}>考题列表</div>
        <ul>
          {exam_topic_list.map((item, index) => {
            return (
              <li key={item._id}>
                <span>
                  {index + 1}. {item.title}{' '}
                </span>
                {item.pass ? <Tag color="green">通过</Tag> : item.is_corret ? <Tag color="red">X</Tag> : ''}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.detail}>
        {exam_topic_list.map((item: any) => {
          return <ExamDetail type="read" topic={item} key={item._id}></ExamDetail>
        })}
      </div>
    </div>
  )
}
