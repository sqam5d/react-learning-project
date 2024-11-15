import { useAppSelector } from '@/store'
import { select_menu } from '@/store/slice/user'
import { useLocation } from 'react-router-dom'

// 是否显示菜单
export default function useIsShowMenu() {
  const menus = useAppSelector(select_menu)
  const location = useLocation()
  const key = location.pathname.split('/')[1]
  // 后端返回的menu里面每个菜单都带有hasMenu选项
  const current = menus?.find(item => {
    return item.key === key
  })

  return current?.hasMenu
}
