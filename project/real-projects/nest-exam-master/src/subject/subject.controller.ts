import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common'
import { SubjectService } from './subject.service'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  // 新增二级课程
  @Post('two')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto)
  }

  // 获取课程树
  @Get()
  findAll(@Request() req) {
    return this.subjectService.findAll(req)
  }

  // 删除二级课程
  @Delete('two/:id')
  remove(@Param('id') id: string) {
    return this.subjectService.remove(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(+id, updateSubjectDto)
  }
}
