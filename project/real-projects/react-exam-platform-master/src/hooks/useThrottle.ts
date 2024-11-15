import { useCallback, useRef } from 'react'

// 节流hooks
export default function useThrottle(fn: (...args: any[]) => void, delay: number) {
  let startTime = useRef(0)

  const throttleCallback = useCallback(
    (...args: any[]) => {
      return function (...args: any[]) {
        // 获取当前时间
        let nowTime = new Date().getTime()
        // 当前时间减去开始的时间
        let interval = nowTime - startTime.current
        // 如果大于等于延迟
        if (interval >= delay) {
          fn(this, args)
          startTime.current = nowTime
        }
      }
    },
    [fn, delay]
  )

  return throttleCallback
}
