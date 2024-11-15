import React, { useEffect, useState } from 'react'
import styles from '@/pages/login/index.module.scss'
import left from './assets/login_desc.png'
import logo from './assets/login_logo.png'
import { Button, Form, Input, message } from 'antd'
import { LoginPost } from '@/util/request'
import { useAppDispatch } from '@/store/index'
import { get_menu_async, set_user_info } from '@/store/slice/user'
import { useNavigate } from 'react-router-dom'

// 登录表单的类型
type FieldType = {
  phone?: string
  code?: string
}

// 验证码倒计时
let TIME = 60

// 登录组件
export default function Login() {
  // 全局提示
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  // 设置倒计时
  const [count, setCount] = useState(0)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  // 倒计时
  useEffect(() => {
    if (count === 0) return
    setTimeout(() => {
      setCount(count - 1)
    }, 1000)
  }, [count])

  // 获取验证码
  const startCode = () => {
    form
      .validateFields(['username'])
      .then(() => {
        setCount(TIME)
      })
      .catch(() => {})
  }

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    messageApi.open({
      type: 'warning',
      content: '你还有未填写的信息'
    })
  }

  // 提交表单
  const onFinish = async (body: any) => {
    const userinfo = await LoginPost(body)
    dispatch(set_user_info(userinfo || {}))

    await dispatch(get_menu_async())
    console.log('login')
    // 如果没有注册
    if (!userinfo?.has_person_info) {
      if (userinfo) {
        navigate('/person_info')
      } else {
        message.error('验证码错误')
      }
    } else {
      if (userinfo.role === 'student') {
        navigate('/exam_select')
      } else {
        navigate('/corret_exam_list')
      }
    }
  }

  return (
    <div className={styles.login}>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={left} alt="" />
        </div>
        <div className={styles.right}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
          <div className={styles.form}>
            <Form form={form} size="large" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="on">
              <Form.Item<FieldType>
                label="用户名"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号!' },
                  { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'), message: '请输入正确的手机号' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType> label="验证码" name="code" rules={[{ required: true, message: '请输入验证码!' }]}>
                <div className={styles.code}>
                  <Input />
                  {count === 0 ? <Button onClick={startCode}>获取验证码</Button> : <Button disabled>{count}</Button>}
                </div>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 11, span: 10 }}>
                <Button type="primary" htmlType="submit" ghost>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
