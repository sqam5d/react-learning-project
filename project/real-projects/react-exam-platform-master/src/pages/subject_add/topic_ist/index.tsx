import { useAppDispatch, useAppSelector } from '@/store'
import { get_topic_list_async, select_active_topic, select_subject_loading, select_topic_list, set_active_topic } from '@/store/slice/subject'
import React from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
import request from '@/util/http'
import { message, Spin } from 'antd'

// 题目列表
export default function TopicList() {
  const dispatch = useAppDispatch()
  // 获取题目列表
  const topic_list = useAppSelector(select_topic_list)
  // 获取选中的题目信息
  const active_topic: any = useAppSelector(select_active_topic)
  const loading = useAppSelector(select_subject_loading)

  // 点击选中的题目，并将仓库中选中题目的信息进行修改
  const itemClick = (item: any) => {
    dispatch(set_active_topic(item))
  }

  // 删除题目
  const deleteSubjectTwo = async (e: any, item: any) => {
    // 阻止冒泡，否则会点击列表的选项，会展示该题目的详情信息
    e.stopPropagation()
    // 进行删除
    const res = await request.delete(`/api/topic/${item._id}`)
    if (res.status === 200) {
      message.success('删除成功')
    }
    // 将当前选中的题目清空
    dispatch(set_active_topic(null))
    // 重新获取题目列表信息
    dispatch(get_topic_list_async(item.two_id))
  }

  return (
    <Spin spinning={loading} delay={500}>
      <div className={styles.list}>
        <ul>
          {topic_list.map((item: any, index: number) => {
            return (
              <li key={index} className={classNames({ active: item._id === active_topic?._id })} onClick={() => itemClick(item)}>
                <span>
                  {index + 1}. {item.title}
                </span>
                <span className={styles.delete} onClick={e => deleteSubjectTwo(e, item)}>
                  删除
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Spin>
  )
}
