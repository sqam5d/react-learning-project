import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { Button, message, Tag } from 'antd'
import ExamDetail from '@/common_components/exam_detail'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_student_exam_topic_list_async, select_current_exam_topic_data, select_exam_topic_list, set_current_exam_topic_id, set_current_subject_two } from '@/store/slice/subject'
import { ExamTopicListDateType, postStudentExam } from '@/util/request'
import classNames from 'classnames'

// 考试界面
export default function Exam() {
  const params = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // 考题列表
  const exam_topic_list = useAppSelector(select_exam_topic_list)
  // 现在选中的题目
  const current_topic = useAppSelector(select_current_exam_topic_data)
  // 获取路由跳转时该二级课程的id
  const subject_two_id = params.subject_two_id as string
  // 根据每个题目是否作答来判断是否可以提交
  const is_submit = exam_topic_list.every((item: ExamTopicListDateType) => {
    return item.answer
  })

  useEffect(() => {
    // 刷新页面后防止id消失
    dispatch(set_current_subject_two(subject_two_id))
    // 获取考题列表
    dispatch(get_student_exam_topic_list_async(subject_two_id))
  }, [])

  // 点击题目
  function clickTopic(item: ExamTopicListDateType) {
    // 设置当前选中的题目
    dispatch(set_current_exam_topic_id(item._id))
  }

  // 点击交卷
  async function submitExam() {
    const res = await postStudentExam({
      topic_list: exam_topic_list,
      two_id: subject_two_id
    })

    if (res.status === 201) {
      message.success('交卷成功')
      navigate('/exam_history')
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.title}>考题列表</div>
        <ul>
          {exam_topic_list.map((item, index) => {
            return (
              <li className={classNames({ active: item._id === current_topic?._id })} key={item._id} onClick={() => clickTopic(item)}>
                <span>
                  {index + 1}. {item.title} {item.answer ? <Tag color="green">已答题</Tag> : ''}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.detail}>
        <ExamDetail type="exam" topic={current_topic!}></ExamDetail>
        <Button disabled={!is_submit} type="primary" className={styles.submit} onClick={() => submitExam()}>
          点击交卷
        </Button>
      </div>
    </div>
  )
}
