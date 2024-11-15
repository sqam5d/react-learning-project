import React from 'react'
import { Button, Form, Input } from 'antd'
import { useAppDispatch } from '@/store'
import { get_student_list_data_async } from '@/store/slice/user'

type FieldType = {
  name?: string
  phone?: boolean
}

// 学生管理的搜索框
export default function Search() {
  const dispatch = useAppDispatch()

  // 点击查询按钮
  function onFinish(value: any) {
    // 清除没有输入的值
    for (let key in value) {
      if (!value[key]) {
        delete value[key]
      }
    }

    // 获取新的列表
    dispatch(
      get_student_list_data_async({
        ...value
      })
    )
  }

  return (
    <>
      <Form layout="inline" name="basic" style={{ maxWidth: 600 }} onFinish={onFinish} autoComplete="off">
        <Form.Item<FieldType> label="花名:" name="name">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="电话" name="phone">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
