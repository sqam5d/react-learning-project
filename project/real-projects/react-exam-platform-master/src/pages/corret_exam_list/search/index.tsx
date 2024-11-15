import React from 'react'
import { Button, Select, Form, Input } from 'antd'
import { useAppDispatch } from '@/store'
import { set_exam_list_data, get_exam_list_async } from '@/store/slice/subject'
import useThrottle from '@/hooks/useThrottle'

type FieldType = {
  user_name?: string
  is_judge?: boolean
}

// 搜索组件
export default function Search() {
  const dispatch = useAppDispatch()

  const onFinish = (values: any) => {
    // 删除没有输入的值
    for (let key in values) {
      if (!values[key] && values[key] !== false) {
        delete values[key]
      }
    }

    // 根据参数查询
    dispatch(
      get_exam_list_async({
        ...values
      })
    )

    // 修改查找参数和现在的页数
    dispatch(
      set_exam_list_data({
        search_params: values,
        current_page: 1
      })
    )
  }

  return (
    <div>
      <Form layout="inline" name="basic" style={{ maxWidth: 600 }} onFinish={useThrottle(onFinish, 2000)()} autoComplete="off">
        <Form.Item<FieldType> label="花名:" name="user_name">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="是否阅卷" name="is_judge">
          <Select
            style={{ width: 120 }}
            options={[
              { value: true, label: '是' },
              { value: false, label: '否' }
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
