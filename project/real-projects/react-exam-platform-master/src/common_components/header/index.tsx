import React from 'react'
import styles from '@/common_components/header/index.module.scss'
import logo from './assets/logo.png'
import message from './assets/message.png'
import { Popover, Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LogoutPost } from '@/util/request'
import { useAppDispatch, useAppSelector } from '@/store'
import { select_user_info, set_user_info } from '@/store/slice/user'
import avatar from './assets/avatar.png'
import { getImgUrl } from '@/util/img'

export default function Header() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const userinfo = useAppSelector(select_user_info)

  // 弹出框的内容
  const popover_content = <div>你的考试已经被批阅</div>

  // 退出登录
  async function handleLogout() {
    // console.log(11111)
    await LogoutPost()
    localStorage.removeItem('menu')
    dispatch(set_user_info({}))
    navigate('/login')
  }

  // 前往个人中心
  const goPersonInfo = () => {
    navigate('/person_info')
  }

  // Dropdown的信息
  const items: MenuProps['items'] = [
    {
      key: 'user',
      label: <div onClick={goPersonInfo}>个人中心</div>
    },
    {
      key: 'logout',
      label: <div onClick={handleLogout}>退出登录</div>
    }
  ]

  function goHome() {
    if (userinfo.role === 'student') {
      navigate('/exam_select')
    } else {
      navigate('/corret_exam_list')
    }
  }

  return (
    <div className={styles.header}>
      {/* logo */}
      <div className={styles.logo} onClick={goHome}>
        <img src={logo} alt="" />
      </div>
      {/* 信息 */}
      <div className={styles.info}>
        {/* 消息框 */}
        <div className={styles.message}>
          <Popover placement="topRight" content={popover_content} title="提示">
            <img src={message} alt="" />
          </Popover>
        </div>
        {/* 头像和名字 */}
        <div className={styles.avator}>
          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <Avatar size={40} src={getImgUrl(userinfo?.avatar) || avatar} />
          </Dropdown>
          <div className={styles.name}>{userinfo?.name}</div>
        </div>
      </div>
    </div>
  )
}
