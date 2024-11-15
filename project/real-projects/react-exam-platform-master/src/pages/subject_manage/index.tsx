import { Button } from 'antd'
import React, { Children, useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Table, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_subject_tree_async, select_subject_tree } from '@/store/slice/subject'
import { deleteSubjectTwo } from '@/util/request'
import AddSubjectTwo from './add_subject_two'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  description: string
}

// 循环添加key
function addSubjectTreeKey(subject_tree: any) {
  const _tree = JSON.parse(JSON.stringify(subject_tree))
  const data = _tree.map((item: any) => {
    let children
    item.key = item.value
    // 是否有children 有则需要递归
    if (item.children?.length > 0) {
      children = addSubjectTreeKey(item.children)
    }
    return {
      ...item,
      children
    }
  })
  return data
}

// 课程管理
export default function SubjectManage() {
  const dispatch = useAppDispatch()
  const subject_tree = useAppSelector(select_subject_tree)
  const { confirm } = Modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // 获取课程的树型结构
    dispatch(get_subject_tree_async())
  }, [])

  // 删除
  const deleteItem = async (item: any) => {
    confirm({
      title: `你确定要删除${item.title}`,
      async onOk() {
        await deleteSubjectTwo(item.value)
        dispatch(get_subject_tree_async())
      },
      onCancel() {}
    })
  }

  // 新增课程
  const addSubject = () => {
    setIsModalOpen(true)
  }

  // 内嵌表格的显示与关闭
  const changeModal = (info: boolean) => {
    setIsModalOpen(info)
  }

  const columns: ColumnsType<DataType> = [
    { title: '排序', dataIndex: 'title', render: (text, record, index) => <>{index + 1}</> },
    { title: '课程类别', dataIndex: 'title', key: 'title' },
    { title: '名称', dataIndex: 'value', key: 'value' },
    {
      title: '操作',
      render: text => (
        <>
          {text.children?.length ? null : (
            <a style={{ color: 'red' }} onClick={() => deleteItem(text)}>
              删除
            </a>
          )}
        </>
      )
    }
  ]

  const data: DataType[] = addSubjectTreeKey(subject_tree)

  return (
    <div className={styles.manage}>
      <div className={styles.add}>
        <Button type="primary" onClick={addSubject}>
          新增课程
        </Button>
        <AddSubjectTwo showing={isModalOpen} changeShowing={changeModal}></AddSubjectTwo>
      </div>
      <div className={styles.table}>
        <Table
          columns={columns}
          expandable={{
            defaultExpandAllRows: true
          }}
          dataSource={data}
          pagination={false}
        />
      </div>
    </div>
  )
}
