import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { TopicService } from './topic.service'
import { CreateTopicDto } from './dto/create-topic.dto'
import { UpdateTopicDto } from './dto/update-topic.dto'

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  // 新增题目
  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(createTopicDto)
  }

  // 获取二级课程对应的题目
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(+id)
  }

  @Get()
  findAll() {
    return this.topicService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.update(+id, updateTopicDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicService.remove(+id)
  }
}
