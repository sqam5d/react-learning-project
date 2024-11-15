import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Role } from 'src/role/role.enum'
import { Subject } from 'src/subject/entities/subject.entity'
import { CustomRequest } from 'src/type'
import { User } from 'src/user/entities/user.entity'
import { Like, Repository } from 'typeorm'
import { CreateExamDto } from './dto/create-exam.dto'
import { AllBody } from './dto/get-all-exam.dto'
import { UpdateExamDto } from './dto/update-exam.dto'
import { Exam } from './entities/exam.entity'
import { ExamSubject } from './entities/exam_subject.entity'

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private readonly exam: Repository<Exam>,
    @InjectRepository(Subject) private readonly subject: Repository<Subject>,
    @InjectRepository(ExamSubject) private readonly exam_subject: Repository<ExamSubject>
  ) {}

  // 考试交卷(多表使用事务)
  async create(createExamDto: CreateExamDto, req: CustomRequest) {
    const user_id = req.session.user_id
    await this.exam.manager.transaction(async manager => {
      // 查找对应的二级课程
      const two_subject = await manager.findOne(Subject, { where: { _id: createExamDto.two_id } })

      // 查找对应的用户
      const user = await manager.findOne(User, { where: { _id: user_id } })

      const exam_list: Exam[] = []

      // 将每个题目添加到exam_list中
      for (let i = 0; i < createExamDto.topic_list.length; i++) {
        const E = new Exam()
        E.answer = createExamDto.topic_list[i].answer
        E.created = createExamDto.topic_list[i].created
        E.dec = createExamDto.topic_list[i].dec
        E.img = createExamDto.topic_list[i].img
        E.title = createExamDto.topic_list[i].title
        await manager.save(Exam, E)
        exam_list.push(E)
      }

      // 创建试卷记录
      const exam_subject = await manager.create(ExamSubject, { subject_name: two_subject.one_key, two_id: two_subject._id, user_id: user._id, user_name: user.name, exam: exam_list })
      await manager.save(ExamSubject, exam_subject)
    })

    return '交卷成功'
  }

  // 批阅试卷
  update(id: number, updateExamDto: UpdateExamDto) {
    this.exam.manager.transaction(async manager => {
      // 将对应的试卷改成已批阅
      await manager.update(ExamSubject, { _id: id }, { is_judge: true })

      // 更新每个题目的状态(变成阅卷)
      updateExamDto.topic_list.map(async item => {
        await manager.update(Exam, { _id: item._id }, { comment: item.comment, pass: item.pass, is_corret: item.is_corret })
      })
    })

    return '批阅成功'
  }

  // 获取所有试卷
  async getAllExam(body: AllBody, req: CustomRequest) {
    let all_exam
    let total

    // 如果权限是学生只能查看自己的答题试卷,老师则查看全部
    if (req.session.role === Role.student) {
      total = await this.exam_subject.count({ where: { user_id: req.session.user_id } })
      all_exam = await this.exam_subject.find({ relations: ['exam'], where: { user_id: req.session.user_id }, skip: (body.pageNo - 1) * body.pageSize, take: body.pageSize })
    } else {
      // 如果传了is_judge是否阅卷
      if (body.is_judge) {
        total = await this.exam_subject.count({ where: { user_name: Like(`%${body.user_name}%`), is_judge: body.is_judge } })
        all_exam = await this.exam_subject.find({ relations: ['exam'], where: { user_name: Like(`%${body.user_name}%`), is_judge: body.is_judge }, skip: (body.pageNo - 1) * body.pageSize, take: body.pageSize })
      } else {
        // 如果没有就是全部
        all_exam = await this.exam_subject.find({ relations: ['exam'], where: { user_name: Like(`%${body.user_name}%`) }, skip: (body.pageNo - 1) * body.pageSize, take: body.pageSize })
        total = await this.exam_subject.count({ where: { user_name: Like(`%${body.user_name}%`) } })
      }
    }

    return { data: all_exam, count: total }
  }

  // 查看单个试卷
  async findOne(id: number) {
    const single_exam = await this.exam_subject.find({ relations: ['exam'], where: { _id: id } })
    return single_exam
  }

  findAll() {
    return `This action returns all exam`
  }

  remove(id: number) {
    return `This action removes a #${id} exam`
  }
}
