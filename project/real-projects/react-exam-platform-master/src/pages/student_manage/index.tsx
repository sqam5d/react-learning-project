import React from 'react'
import Search from './search'
import styles from './index.module.scss'
import ManageTable from './table'
import SManageModal from './modal'

// 学员管理
export default function StudentManage() {
  return (
    <div className={styles.manage}>
      <Search></Search>
      <ManageTable></ManageTable>
      <SManageModal></SManageModal>
    </div>
  )
}
