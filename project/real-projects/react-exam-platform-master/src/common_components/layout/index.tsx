import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../header'
import Menu from '../menu'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_menu_async, select_user_info } from '@/store/slice/user'
import useIsShowMenu from '@/hooks/useIsShowMenu'

export default function Layout() {
  const dispatch = useAppDispatch()

  const isShowMenu = useIsShowMenu()

  useEffect(() => {
    dispatch(get_menu_async())
  }, [])

  return (
    <div className="layout">
      <div className="header">
        <Header></Header>
      </div>
      <div className="menu">
        {isShowMenu ? <Menu></Menu> : null}
        <Outlet></Outlet>
      </div>
    </div>
  )
}
