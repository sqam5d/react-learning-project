import React, { useEffect, useState } from 'react'
import { Button, Form, Input, DatePicker, theme, Select, message } from 'antd'
import styles from './index.module.scss'
import CustomUpload from '@/common_components/upload'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { getImgUrl, upload_imgs } from '@/util/img'
import { patchPersonInfo } from '@/util/request'
import { useAppDispatch, useAppSelector } from '@/store'
import { select_user_info, get_user_info_async } from '@/store/slice/user'
import { AxiosResData } from '@/util/http'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

// 定义表单类型
export type PersonInfoFieldType = {
  avatar?: string
  name: string
  money: string
  techStack: string
  edu: string
  graduation_time: Date
  vChat: string
}

const eduOptions = ['初中', '高中', ' 大专', '成人本科', '专升本', '二本', '一本', '研究生']

// 个人信息
export default function PersonInfo() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const personInfo = useAppSelector(select_user_info)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // 是否为编辑状态
  const IS_EDIT = personInfo?.has_person_info

  // 用户信息回显
  useEffect(() => {
    // 如果是编辑个人用户信息
    if (personInfo?.has_person_info) {
      form.setFieldsValue({ ...personInfo, graduation_time: dayjs(personInfo.graduation_time) })
      const avatar = personInfo.avatar
      // 变量后使用 ！：表示类型推断排除null、undefined
      let fileName
      // 不知道为什么后端有时候是数组有时候是字符串
      if (Array.isArray(avatar)) {
        fileName = avatar[0].split('/').at(-1)!
      } else {
        fileName = avatar.split('/').at(-1)!
      }
      // 设置图片的信息
      setFileList([
        {
          uid: fileName,
          name: fileName,
          status: 'done',
          url: getImgUrl(avatar)
        }
      ])
    }
  }, [personInfo])

  // 处理图片的改变
  const handleImgChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setFileList(
      info.fileList.map((item: any) => {
        return {
          ...item,
          status: 'done'
        }
      })
    )
  }

  // 表单提交
  const onFinish = async (values: any) => {
    // 有头像
    if (fileList.length > 0) {
      // 过滤出不是后端返回的图片
      const needUploadImg = fileList.filter(file => !file.url)
      if (needUploadImg.length > 0) {
        // 这是个数组
        const imgUrl = (await upload_imgs(fileList)) as string[]
        values.avatar = imgUrl[0]
      }
    } else {
      // 没有头像就删除avatar这个属性
      delete values['avatar']
    }

    const res: AxiosResData = await patchPersonInfo(personInfo._id, values)
    if (res.status === 200) {
      dispatch(get_user_info_async())
      message.success('录入成功')
      // 判断权限是否是student
      if (personInfo.role === 'student') {
        navigate('/exam_select')
      } else {
        navigate('/corret_exam_list')
      }
    } else {
      message.error('录入失败')
    }
  }

  // 返回上一页
  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className={styles.person_info}>
      <div className={styles.title}>
        {IS_EDIT ? (
          <span className={styles.blue}>个人中心</span>
        ) : (
          <>
            欢迎进入<span className={styles.blue}>请填写个人信息</span>
          </>
        )}
      </div>
      <div className={styles.form}>
        <Form name="basic" form={form} labelAlign="left" labelCol={{ span: 3 }} wrapperCol={{ span: 12 }} style={{ maxWidth: 600 }} initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
          <Form.Item<PersonInfoFieldType> label="头像" name="avatar">
            <CustomUpload fileList={fileList} onChange={handleImgChange}></CustomUpload>
          </Form.Item>
          <Form.Item<PersonInfoFieldType> label="花名" name="name" rules={[{ required: true, message: '请输入花名!' }]}>
            <Input />
          </Form.Item>

          <Form.Item<PersonInfoFieldType> label="当前薪资" name="money" rules={[{ required: true, message: '请输入当前薪资!' }]}>
            <Input />
          </Form.Item>

          <Form.Item<PersonInfoFieldType> label="技术栈" name="techStack" rules={[{ required: true, message: '请输入技术栈!' }]}>
            <Input />
          </Form.Item>

          <Form.Item<PersonInfoFieldType> label="学历" name="edu" rules={[{ required: true, message: '请输入学历!' }]}>
            <Select
              style={{ width: 120 }}
              options={eduOptions.map((item: string) => {
                return {
                  label: item,
                  value: item
                }
              })}
            />
          </Form.Item>

          <Form.Item<PersonInfoFieldType> label="毕业时间" name="graduation_time" rules={[{ required: true, message: '请选择毕业时间!' }]}>
            <DatePicker placeholder="请选择毕业时间" />
          </Form.Item>

          <Form.Item<PersonInfoFieldType> label="微信" name="vChat" rules={[{ required: true, message: '请输入微信!' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            {IS_EDIT ? (
              <>
                <Button style={{ width: 100, marginRight: 60 }} size="large" type="primary" htmlType="submit">
                  确认修改
                </Button>
                <Button style={{ width: 100 }} onClick={goBack}>
                  返回
                </Button>
              </>
            ) : (
              <Button style={{ width: 200 }} size="large" type="primary" htmlType="submit">
                保存信息
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
