import { Module } from '@nestjs/common'
import { ExamService } from './exam.service'
import { ExamController } from './exam.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Exam } from './entities/exam.entity'
import { ExamSubject } from './entities/exam_subject.entity'
import { Subject } from 'src/subject/entities/subject.entity'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamSubject, Subject, User])],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
