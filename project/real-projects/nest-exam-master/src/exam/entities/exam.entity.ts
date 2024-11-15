import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ExamSubject } from './exam_subject.entity'

// 考试的每个题目
@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  _id: number

  // 标题
  @Column()
  title: string
  // 描述
  @Column()
  dec: string
  // 图片
  @Column()
  img: string

  // 二级课程创建时间
  @Column({ nullable: true, comment: '二级课程创建时间' })
  created: string

  // 答案
  @Column()
  answer: string

  // 批阅评论
  @Column({ nullable: true })
  comment: string

  // 是否批改
  @Column({ nullable: true })
  is_corret: boolean

  // 是否通过(正确)
  @Column({ nullable: true })
  pass: boolean

  @ManyToOne(() => ExamSubject, exam_subject => exam_subject.exam)
  @JoinColumn()
  exam_subject: ExamSubject[]
}
