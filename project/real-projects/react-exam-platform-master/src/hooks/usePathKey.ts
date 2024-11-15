import { useLocation } from 'react-router-dom'
import { type RouterKeys } from '@/config'

// 监视当前路由的变化
export function usePathKey() {
  let location = useLocation()

  //备注: 引入RouterKeys这个没有想到
  let pathKey = location.pathname.split('/')[1] as RouterKeys
  return pathKey
}
