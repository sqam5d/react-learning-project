import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common'
import { ExamService } from './exam.service'
import { CreateExamDto } from './dto/create-exam.dto'
import { UpdateExamDto } from './dto/update-exam.dto'
import { AllBody } from './dto/get-all-exam.dto'

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // 考试交卷
  @Post('create')
  create(@Body() createExamDto: CreateExamDto, @Request() req) {
    return this.examService.create(createExamDto, req)
  }

  // 批阅试卷
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto)
  }

  // 查看所有试卷
  @Post()
  getAllExam(@Body() body: AllBody, @Request() req) {
    return this.examService.getAllExam(body, req)
  }

  // 查看单个试卷
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examService.findOne(+id)
  }

  @Get()
  findAll() {
    return this.examService.findAll()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examService.remove(+id)
  }
}
