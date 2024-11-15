import { Module } from '@nestjs/common'
import { SubjectService } from './subject.service'
import { SubjectController } from './subject.controller'
import { Subject } from './entities/subject.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Subject, User])],
  controllers: [SubjectController],
  providers: [SubjectService]
})
export class SubjectModule {}
