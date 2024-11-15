import React, { useEffect, useState } from 'react'
import { Checkbox, message, Modal } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_student_list_data_async, select_is_show_student_edit, select_student_info, select_student_list_data, set_is_show_student_edit, set_student_info } from '@/store/slice/user'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { select_subject_tree } from '@/store/slice/subject'
import { patchStudentRole } from '@/util/request'

// 学生权限的modal框
export default function SManageModal() {
  const dispatch = useAppDispatch()
  const showing = useAppSelector(select_is_show_student_edit)
  const subject_tree = useAppSelector(select_subject_tree)
  const student_info = useAppSelector(select_student_info)
  const student_list_data = useAppSelector(select_student_list_data)

  // 处理树型结构获取每个二级标题
  const handleSubjectTree = (subject_tree: any) => {
    const subject_tree_2 = JSON.parse(JSON.stringify(subject_tree))
    const arr: any = []
    subject_tree_2.forEach((item: any) => {
      return item.children?.forEach((i2: any) => {
        arr.push({
          label: i2.title,
          value: i2.value
        })
      })
    })
    return arr
  }

  // 学生原有的权限
  const checkStudentInfo = (options: any, student_info: any) => {
    const arr: any = []
    options.forEach((i1: any) => {
      student_info.topic_role?.forEach((i2: any) => {
        if (i1.value === i2) {
          arr.push(i1.value)
        }
      })
    })
    return arr
  }

  // 获取所有的二级课程
  const options = handleSubjectTree(subject_tree)
  // 获取学生拥有的二级课程
  const studentRole = checkStudentInfo(options, student_info)

  // 点击确认按钮
  const handleOk = async () => {
    // setIsModalOpen(false)
    const res: any = await patchStudentRole(student_info._id, student_info.topic_role)
    if (res.status === 200) {
      message.success('修改成功')
      dispatch(
        get_student_list_data_async({
          skip: 10 * (student_list_data.current - 1)
        })
      )
      dispatch(set_is_show_student_edit(false))
    }
  }

  // 点击取消按钮
  const handleCancel = () => {
    dispatch(set_is_show_student_edit(false))
  }

  // 多选框变化 设置学生可以考试的二级课程
  const checkChange = (checkedValues: CheckboxValueType[]) => {
    dispatch(
      set_student_info({
        ...student_info,
        topic_role: checkedValues
      })
    )
  }

  return (
    <div>
      <Modal title="编辑课程权限" open={showing} onOk={handleOk} onCancel={handleCancel}>
        <Checkbox.Group options={options} onChange={checkChange} value={studentRole} />
      </Modal>
    </div>
  )
}
