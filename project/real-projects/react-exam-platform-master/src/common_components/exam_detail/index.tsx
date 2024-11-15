import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Input, Button, Tag } from 'antd'
import { ExamTopicListDateType } from '@/util/request'
import { useAppDispatch, useAppSelector } from '@/store'
import { select_current_exam_topic_id, set_answer_exam_topic_list, set_corret_exam_topic_list } from '@/store/slice/subject'
import classNames from 'classnames'

type ExamDetailType = {
  type: 'corret' | 'read' | 'exam'
  topic: ExamTopicListDateType
}

// 考试题目的具体信息
export default function ExamDetail({ type, topic }: ExamDetailType) {
  const { TextArea } = Input
  const [corret, setCorret] = useState('')
  const [answer, setAnswer] = useState('')
  const dispatch = useAppDispatch()
  const current_topic_id = useAppSelector(select_current_exam_topic_id)

  // 根据题目的id获取不同的批阅
  useEffect(() => {
    setCorret(topic?.comment)
  }, [topic?._id])

  // 根据试卷题目的id获取不同的答案
  useEffect(() => {
    setAnswer(topic?.answer)
  }, [topic?._id])

  // 我的批阅
  function corretChange(e: any) {
    setCorret(e.target.value)
  }

  // 阅卷时候的通过，为对应的题目添加批阅的信息
  function pass() {
    dispatch(
      set_corret_exam_topic_list({
        // 要传入id否则不知道修改哪个题目的信息
        _id: current_topic_id,
        pass: true,
        is_corret: true,
        comment: corret
      })
    )
  }

  // 阅卷时候的不通过，为对应的题目添加批阅的信息
  function unpass() {
    dispatch(
      set_corret_exam_topic_list({
        _id: current_topic_id,
        pass: false,
        is_corret: true,
        comment: corret
      })
    )
  }

  // 作答区域
  function answerChange(e: any) {
    setAnswer(e.target.value)
  }

  // 保存作答
  function saveAnswer() {
    dispatch(
      set_answer_exam_topic_list({
        _id: topic._id,
        answer
      })
    )
  }

  return (
    <div className={`${styles.wrap} ${classNames({ read: type === 'read' })}`}>
      <div className={styles.title}>
        <div className={`blue ${styles.title_text}`}>
          题目
          {type === 'read' ? topic.pass ? <Tag color="green">通过</Tag> : <Tag color="red">未通过</Tag> : ''}
        </div>
        <p>{topic?.title} </p>
      </div>
      <div className={styles.dec}>
        <div className={`blue ${styles.dec_text}`}>描述</div>
        <p>{topic?.dec}</p>
      </div>
      <div className={styles.answer}>
        <div className={`blue ${styles.answer_text}`}>答案</div>
        <TextArea value={answer} disabled={type !== 'exam'} rows={4} placeholder="请填入答案" onChange={answerChange} />
      </div>
      {/* 如果不是答题就显示我的批阅，如果是就显示保存作答 */}
      {type !== 'exam' ? (
        <div className={styles.corret}>
          <div className={`blue ${styles.corret_text}`}>我的批阅</div>
          <TextArea value={corret} rows={4} placeholder="请填入批阅" disabled={type !== 'corret'} onChange={corretChange} />
        </div>
      ) : (
        <Button type="primary" style={{ marginTop: 20 }} onClick={() => saveAnswer()}>
          保存作答
        </Button>
      )}
      {/* 等于阅卷的时候才出现通过和不通过 */}
      {type === 'corret' ? (
        <div style={{ marginTop: 20 }}>
          <Button style={{ marginRight: 20 }} size="large" type="primary" onClick={pass}>
            通过
          </Button>
          <Button size="large" danger type="primary" onClick={unpass}>
            不通过
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
