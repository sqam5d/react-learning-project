import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Exam } from './exam.entity'

// 一张试卷(考过的二级课程)
@Entity()
export class ExamSubject {
  @PrimaryGeneratedColumn()
  _id: number

  @Column({ default: false })
  is_judge: boolean

  @Column()
  subject_name: string

  @Column()
  two_id: number

  @Column()
  user_id: number

  @Column()
  user_name: string

  @CreateDateColumn()
  created: string

  @OneToMany(() => Exam, exam => exam.exam_subject)
  exam: Exam[]
}
