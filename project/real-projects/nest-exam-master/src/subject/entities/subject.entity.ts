import { Topic } from 'src/topic/entities/topic.entity'
import { User } from 'src/user/entities/user.entity'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  _id: number

  // 一级课程
  @Column()
  one_key: string

  // 二级课程
  @Column()
  two_name: string

  @CreateDateColumn()
  created: Date

  @OneToMany(() => Topic, topic => topic.two)
  topic: Topic[]

  @ManyToMany(() => User, user => user.subject)
  user: User[]

  @DeleteDateColumn()
  isDeleted: Date
}
