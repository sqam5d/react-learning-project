import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Tag, Form, Input, Button, message } from 'antd'
import CustomUpload from '@/common_components/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_topic_list_async, select_active_topic, select_subject_two_active, set_active_topic } from '@/store/slice/subject'
import type { UploadProps } from 'antd/es/upload'
import { upload_imgs } from '@/util/img'
import request from '@/util/http'
import { patchTopic, postTopic } from '@/util/request'

type FieldType = {
  title?: string
  dec?: string
}

// 题目详情
export default function TopicDetail() {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  // upload的状态
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 获取当前选中的题目,该选中的题目是通过列表组件点击的
  const active_topic = useAppSelector(select_active_topic)
  // 获取当前选中的二级课程
  const active_subject_two = useAppSelector(select_subject_two_active)

  useEffect(() => {
    // 如果不存在选中的题目则清空表格内容
    if (!active_topic) {
      reset()
    } else {
      // 设置表单的回显
      form.setFieldsValue(active_topic)
      if (active_topic.img?.length > 0) {
        setFileList(
          active_topic.img.map((item: any) => {
            // at是新特征
            const fileName = item.url?.split('/').at(-1)
            return {
              uid: fileName,
              name: fileName,
              status: 'done',
              url: '//' + item
            }
          })
        )
      } else {
        setFileList([])
      }
    }
  }, [active_topic])

  // 保存题目
  const onFinish = async (values: any) => {
    console.log(fileList)
    // 需要上传的图片文件（如果没有则不用处理）
    if (fileList.length > 0) {
      // 如果是后端返回的图片经过useEffect处理有url 如果图片没动则不用修改
      const needImgUpload = fileList.filter(item => !item.url)
      if (needImgUpload.length > 0) {
        // 腾旭云的上传图片
        const needImg = await upload_imgs(fileList)
        values.img = needImg
      }
    } else {
      values.img = []
    }

    // 如果不存在则为新增
    if (active_topic?.hasOwnProperty('_id')) {
      // const res = await request.patch(`/api/topic/${active_topic._id}`, {
      //   ...values
      // })
      const res = await patchTopic(active_topic._id, { ...values })

      if (res.status === 200) {
        messageApi.success('修改成功')
      }
      // 新增
    } else {
      const res = await postTopic({ ...values, two_id: active_subject_two.value })

      if (res.status === 201) {
        messageApi.success('新增成功')
        reset()
      }
    }
    // 获取题目列表
    dispatch(get_topic_list_async(active_subject_two.value))
  }

  // 提交失败
  const onFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: 'warning',
      content: '你还有未填写信息'
    })
  }

  // 处理图片改变
  const handleImgChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(
      newFileList.map(item => {
        return {
          ...item,
          //如果不加done则upload会一直出现loading
          status: 'done'
        }
      })
    )
  }

  // 重置表单清空数据
  const reset = (): any => {
    form.resetFields()
    setFileList([])
  }

  return (
    <div className={styles.detail}>
      {contextHolder}
      <div className={styles.header}>
        <span className={styles.name}>题目详情</span>
        {active_topic?.hasOwnProperty('_id') ? <Tag color="warning">修改</Tag> : <Tag color="success">新增</Tag>}
      </div>
      <div className={styles.form}>
        <Form name="basic" form={form} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item<FieldType> label="题干:" name="title" rules={[{ required: true, message: '请输入题干!' }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="描述:" name="dec">
            <Input.TextArea />
          </Form.Item>

          <Form.Item<FieldType> label="图片:">
            <CustomUpload fileList={fileList} onChange={handleImgChange}></CustomUpload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
            <Button type="primary" htmlType="submit">
              保存题目
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
