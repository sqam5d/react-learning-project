import { Exam } from 'src/exam/entities/exam.entity'
import { Subject } from 'src/subject/entities/subject.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  _id: number

  @Column()
  title: string

  @Column()
  dec: string

  @Column()
  img: string

  @CreateDateColumn()
  created: Date

  @ManyToOne(() => Subject, subject => subject.topic)
  @JoinColumn()
  two: Subject[]
}
