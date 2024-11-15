import useRenderCount from '@/hooks/useRenderCount'
import { useAppDispatch } from '@/store'
import { get_subject_tree_async, get_topic_list_async, set_subject_two_active } from '@/store/slice/subject'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import TopicSearch from './search'
import TopicDetail from './topic_detail'
import TopicList from './topic_ist'

// 考题管理
export default function SubjectAdd() {
  const dispatch = useAppDispatch()

  useRenderCount('课程添加')

  useEffect(() => {
    // get_subject_tree_async后.then就可以拿到payload的值
    dispatch(get_subject_tree_async()).then((res: any) => {
      dispatch(set_subject_two_active(res.payload[0].children[0]))
      dispatch(get_topic_list_async(res.payload[0].children[0].value))
    })
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.search}>
        <TopicSearch></TopicSearch>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <TopicList></TopicList>
        </div>
        <div className={styles.right}>
          <TopicDetail></TopicDetail>
        </div>
      </div>
    </div>
  )
}
