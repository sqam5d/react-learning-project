import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Subject } from 'src/subject/entities/subject.entity'
import { Repository } from 'typeorm'
import { CreateTopicDto } from './dto/create-topic.dto'
import { UpdateTopicDto } from './dto/update-topic.dto'
import { Topic } from './entities/topic.entity'

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private readonly topic: Repository<Topic>,
    @InjectRepository(Subject) private readonly subject: Repository<Subject>
  ) {}

  // 新增题目
  async create(createTopicDto: CreateTopicDto) {
    const two_id = Number(createTopicDto.two_id)
    // 通过two_id找到对应的二级课程并且通过relations获取对应的topic
    const subject_data = await this.subject.findOne({ relations: ['topic'], where: { _id: two_id } })

    const topic = new Topic()
    topic.title = createTopicDto.title
    topic.dec = createTopicDto.dec
    topic.img = createTopicDto.img
    await this.topic.save(topic)

    const subject_topic = subject_data.topic

    // 把数据库之前存的和前端传过来的一起保存，如何只保存前端传的那之前数据库里topic对应的two_id会变成null
    subject_data.topic = [...subject_topic, topic]

    await this.subject.save(subject_data)

    return subject_data
  }

  // 获取二级课程对应的题目
  async findOne(id: number) {
    const subject_data = await this.subject.findOne({ relations: ['topic'], where: { _id: id } })

    return subject_data.topic
  }

  findAll() {
    return `This action returns all topic`
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`
  }

  remove(id: number) {
    return `This action removes a #${id} topic`
  }
}
