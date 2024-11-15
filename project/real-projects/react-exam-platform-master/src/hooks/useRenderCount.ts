import { useRef } from 'react'

// 渲染次数统计
export default function useRenderCount(name: string) {
  const ref = useRef(0)
  ref.current++
  console.log(`${name}已经渲染了${ref.current}次`)
}
