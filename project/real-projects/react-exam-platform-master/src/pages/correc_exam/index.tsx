import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'
import ExamDetail from '@/common_components/exam_detail'
import { Button, message, Tag } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_exam_topic_list_async, select_current_exam_topic_data, select_current_exam_topic_id, select_exam_topic_list, set_clear_exam_topic_list, set_current_exam_topic_id } from '@/store/slice/subject'
import { useNavigate, useParams } from 'react-router-dom'
import { ExamTopicListDateType, patchExam } from '@/util/request'
import useRenderCount from '@/hooks/useRenderCount'

export default function CorretExam() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // 标记是否全部批阅
  // const [is_all_corret, setIs_all_corret] = useState(false)

  // 当前题目的id
  const current_exam_topic_id = useAppSelector(select_current_exam_topic_id)
  // 考试题目列表
  const exam_topic_list = useAppSelector(select_exam_topic_list)
  // 当前的考试题目
  const current_exam_topic = useAppSelector(select_current_exam_topic_data)

  // 获取路由跳转过来带的参数
  const exam_id = params.exam_id as string

  useRenderCount('阅卷')

  useEffect(() => {
    // 根据试卷id获取对应的试卷
    dispatch(get_exam_topic_list_async(exam_id!))
    // 组件卸载时清空数据
    return () => {
      dispatch(set_clear_exam_topic_list([]))
    }
  }, [exam_id])

  // 放入useEffect中 每次会多渲染两次
  const is_all_corret = exam_topic_list.every(item => {
    return item.is_corret === true
  })

  // useEffect(() => {
  //   const is_all_corret = exam_topic_list.every(item => {
  //     return item.is_corret === true
  //   })
  //   setIs_all_corret(is_all_corret)
  // }, [exam_topic_list])

  // 点击左边列表后，将当前点击的题目的id进行保存，然后在所有的题目列表中查找被选中的id，然后获取对应题目的信息
  const clickItem = (item: ExamTopicListDateType) => {
    dispatch(set_current_exam_topic_id(item._id))
  }

  // 只有每个试卷都批改后才能提交阅卷
  const submit = async () => {
    const res = await patchExam(exam_id, { topic_list: exam_topic_list })
    if (res.status === 200) {
      message.success('阅卷成功')
      navigate('/corret_exam_list')
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        <div className={styles.title}>考题列表</div>
        <ul>
          {exam_topic_list.map((item, index) => {
            return (
              <li key={item._id} onClick={() => clickItem(item)} className={classNames({ active: current_exam_topic_id === item._id })}>
                <span>
                  {index + 1}. {item.title}{' '}
                </span>
                {item.pass ? <Tag color="green">√</Tag> : item.is_corret ? <Tag color="red">X</Tag> : ''}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.detail}>
        <ExamDetail type="corret" topic={current_exam_topic!}></ExamDetail>
        <Button size="large" className={styles.submit} disabled={!is_all_corret} onClick={submit}>
          提交阅卷
        </Button>
      </div>
    </div>
  )
}
