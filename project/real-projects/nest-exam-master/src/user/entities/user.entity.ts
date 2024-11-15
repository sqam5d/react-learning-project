import { Subject } from 'src/subject/entities/subject.entity'
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  _id: number

  @Column('varchar')
  phone: string

  @Column('varchar')
  role: string

  @Column({ default: false })
  has_person_info: boolean

  @Column({ type: 'varchar', default: '123' })
  avatar: string

  @CreateDateColumn()
  created: Date

  @Column({ type: 'varchar', nullable: true })
  edu: string

  @Column({ type: 'varchar', nullable: true })
  graduation_time: string

  @Column({ type: 'varchar', nullable: true })
  money: string

  @Column({ type: 'varchar', nullable: true })
  name: string

  @Column({ type: 'varchar', nullable: true })
  techStack: string

  @Column({ type: 'varchar', nullable: true })
  vChat: string

  @ManyToMany(() => Subject, subject => subject.user, {
    cascade: true, // 级联保存、更新、删除操作
    onUpdate: 'CASCADE', // 级联更新
    onDelete: 'CASCADE' // 级联删除
  })
  @JoinTable()
  subject: Subject[]
}
