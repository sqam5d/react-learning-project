import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Select, message } from 'antd'
import { getSubjectOne, postSubjectTwo } from '@/util/request'
import { useAppDispatch } from '@/store'
import { get_subject_tree_async } from '@/store/slice/subject'

type AddSubjectTwoType = {
  showing: boolean
  changeShowing: (a: boolean) => void
}
export type postSubjectTwoFieldType = {
  one_key?: string
  two_name?: string
}

// 新增课程的内嵌表格
export default function AddSubjectTwo({ showing, changeShowing }: AddSubjectTwoType) {
  const [options, setOpions] = useState([])
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 获取一级课程
    if (showing) {
      // 重置表格信息
      form.resetFields()
      // 获取一级课程
      getSubjectOne().then((res: any) => {
        // console.log(res)
        setOpions(
          res.map((item: any) => {
            return {
              label: item.name,
              value: item.key
            }
          })
        )
      })
    }
  }, [showing])

  // 点击确认按钮
  const handleOk = () => {
    // 进行表单验证
    form
      .validateFields(['one_key', 'two_name'])
      .then(async res => {
        // 新增二级课程
        const result: any = await postSubjectTwo(res)
        if (result.status === 201) {
          message.success('新增成功')
          dispatch(get_subject_tree_async())
          changeShowing(false)
        }
      })
      .catch(err => {
        changeShowing(true)
        message.warning('还有信息未填写')
      })
  }

  // 点击取消按钮
  const handleCancel = () => {
    changeShowing(false)
  }

  // // 选择框的改变
  // function handleChange(item: string) {
  //   console.log(item)
  // }

  return (
    <>
      <Modal title="新增课程" open={showing} onOk={handleOk} onCancel={handleCancel}>
        <Form name="basic" form={form} initialValues={{ remember: true }} onFinish={handleOk} autoComplete="off">
          <Form.Item<postSubjectTwoFieldType> label="课程类别" name="one_key" rules={[{ required: true, message: '请输入课程类别!' }]}>
            <Select style={{ width: 120 }} options={options} />
          </Form.Item>

          <Form.Item<postSubjectTwoFieldType> label="课程名称" name="two_name" rules={[{ required: true, message: '请输入课程名称!' }]}>
            <Input />
          </Form.Item>
          {/* 
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  )
}
