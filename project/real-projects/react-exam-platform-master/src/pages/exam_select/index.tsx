import { useAppDispatch, useAppSelector } from '@/store'
import { get_subject_tree_async, select_current_subject_two, select_subject_tree, set_current_subject_two } from '@/store/slice/subject'
import { SubjectTreeType } from '@/util/request'
import { Button, message } from 'antd'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

// 考题选择
export default function ExamSelect() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // 获取树型结构
  const subject_tree = useAppSelector(select_subject_tree)
  // 当前选中的二级课程
  const current_subject_two = useAppSelector(select_current_subject_two)

  useEffect(() => {
    // 获取课程树
    dispatch(get_subject_tree_async())
  }, [])

  // 当二级题目被点击
  const subjectTwoClick = (item: SubjectTreeType) => {
    // 如果是没有此课程的权限
    if (!item.can_exam) {
      return
    }
    dispatch(set_current_subject_two(item))
  }

  // 开始答题
  const beginExam = () => {
    if (Object.values(current_subject_two).length > 0) {
      navigate(`/exam/${current_subject_two.value}`)
    } else {
      message.warning('请选择题目')
      return
    }
  }

  return (
    <div className={styles.wrap}>
      {subject_tree?.map((item: SubjectTreeType) => {
        return (
          <div key={item.value} className={styles.exam}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.content}>
              {item.children?.map((i2: SubjectTreeType) => {
                return (
                  <div key={i2.value} className={classNames({ children: i2.can_exam, disabled_children: !i2.can_exam, select_children: i2.value === current_subject_two.value })} onClick={() => subjectTwoClick(i2)}>
                    {i2.title}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className={styles.begin}>
        <Button type="primary" style={{ width: 300 }} onClick={beginExam}>
          开始答题
        </Button>
      </div>
    </div>
  )
}
