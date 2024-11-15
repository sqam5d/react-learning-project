import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Button, Input, Table, Tag, Form, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { get_admin_list_async, select_admin_list } from '@/store/slice/user'
import { useAppDispatch, useAppSelector } from '@/store'
import CustomUpload from '@/common_components/upload'
import dayjs from 'dayjs'
import FormItem from 'antd/es/form/FormItem'
import { postAddAdmin } from '@/util/request'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

// 管理员管理
export default function AdminManage() {
  const dispatch = useAppDispatch()
  const admin_list = useAppSelector(select_admin_list)

  // 获取管理员列表
  useEffect(() => {
    dispatch(get_admin_list_async())
  }, [])

  // 给每一个admin添加key属性
  const data: DataType[] = admin_list.map((item: any) => {
    return {
      ...item,
      key: item._id
    }
  })

  const columns: ColumnsType<DataType> = [
    {
      title: '头像',
      key: 'avatar',
      dataIndex: 'avatar',
      render: (_, record) => (
        <>
          <img style={{ width: 80, borderRadius: '50%' }} src={_} alt="" />
        </>
      )
    },
    {
      title: '_id',
      dataIndex: '_id',
      key: '_id',
      render: text => <a>{text}</a>
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'created',
      key: 'created',
      render: (_, record) => {
        return <>{dayjs(_).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    }
  ]

  // 点击新增按钮
  async function onFinish({ phone }: { phone: string }) {
    const res: any = await postAddAdmin(phone)
    if (res.status === 201) {
      message.success('新增成功')
    }
  }

  return (
    <div>
      <div className={styles.search}>
        <Form onFinish={onFinish} layout="inline">
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号!' },
              { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'), message: '请输入正确的手机号' }
            ]}
          >
            <Input />
          </Form.Item>
          <FormItem>
            <Button style={{ marginLeft: 20 }} htmlType="submit" type="primary">
              新增
            </Button>
          </FormItem>
        </Form>
      </div>
      <div className={styles.table}>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}
