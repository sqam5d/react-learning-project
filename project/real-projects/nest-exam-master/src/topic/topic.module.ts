import { Module } from '@nestjs/common'
import { TopicService } from './topic.service'
import { TopicController } from './topic.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Topic } from './entities/topic.entity'
import { Subject } from '../subject/entities/subject.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Subject])],
  controllers: [TopicController],
  providers: [TopicService]
})
export class TopicModule {}
