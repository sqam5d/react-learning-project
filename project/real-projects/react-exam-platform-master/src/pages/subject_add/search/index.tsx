import styles from './index.module.scss'
import React, { useState } from 'react'
import { TreeSelect, Button } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_topic_list_async, select_subject_tree, select_subject_two_active, set_active_topic, set_subject_two_active } from '@/store/slice/subject'
import useThrottle from '@/hooks/useThrottle'

// 禁用一级题目
const disabledTree = (tree: any) => {
  const _tree = JSON.parse(JSON.stringify(tree))
  return _tree.map((item: any) => {
    if (item?.children?.length > 0) {
      item.disabled = true
      disabledTree(item.children)
    }
    return item
  })
}

// 搜索框
export default function TopicSearch() {
  // 获取一级课程和二级课程的树型结构
  const subject_tree = useAppSelector(select_subject_tree)
  // 当前选中的二级题目
  const subject_two_active = useAppSelector(select_subject_two_active)
  const dispatch = useAppDispatch()

  // 点击树型结构
  const onChange = (newValue: string, titleArr: any) => {
    // console.log(newValue, titleArr)
    // 设置树型选择器的高亮
    dispatch(
      set_subject_two_active({
        title: titleArr[0],
        value: newValue
      })
    )

    // 根据二级课程id获取题目列表
    dispatch(get_topic_list_async(newValue))
  }

  // 新增题目
  const addTopic = () => {
    console.log(22222)
    // 将当前选中二级课程里面的题目进行清空
    dispatch(set_active_topic(null))
  }

  const treeData = disabledTree(subject_tree)

  return (
    <div className={styles.search}>
      <div className={styles.title}>{subject_two_active.title}</div>
      <div className={styles.tree}>
        <TreeSelect style={{ width: '100%' }} value={subject_two_active.value} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} placeholder="请选择课程" allowClear treeDefaultExpandAll onChange={onChange} treeData={treeData} />
      </div>
      <div>
        <Button type="primary" onClick={useThrottle(addTopic, 2000)()}>
          新增题目
        </Button>
      </div>
    </div>
  )
}
