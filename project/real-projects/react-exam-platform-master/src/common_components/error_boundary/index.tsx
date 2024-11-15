import React, { Component } from 'react'

// 组件渲染错误处理，可以放入全局中比如index.tsx  或者单独放入复杂或者不稳定的组件
export default class ErrorBoundary extends Component {
  state: any
  props: any

  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>鸽鸽，页面出错啦</h1>
    }
    return this.props.children
  }
}
