import React, { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { usePathKey } from '@/hooks/usePathKey'
import { useAppSelector } from '@/store'
import { select_menu } from '@/store/slice/user'
import MenuItem from 'antd/es/menu/MenuItem'

type MenuItem = {
  label: string
  key: string
  path: string
}

// 菜单
const App: React.FC = () => {
  const navigate = useNavigate()
  // 设置哪个高亮
  const [current, setCurrent] = useState('read_exam')
  const menu: MenuItem[] = useAppSelector(select_menu)
  // 返回当前页面的路由信息
  const pathKey = usePathKey()

  // 符合menu组件库的属性
  const items: MenuProps['items'] = menu.map(item => {
    return {
      label: item.label,
      key: item.key,
      path: item.path
    }
  })

  useEffect(() => {
    setCurrent(pathKey)
  }, [pathKey])

  // 点击菜单
  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key)

    const navPath = menu?.find(item => {
      return item.key === e.key
    })?.path as string

    navigate(navPath)
  }

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
}

export default App
