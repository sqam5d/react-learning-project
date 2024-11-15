import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomRequest } from 'src/type'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Subject } from './entities/subject.entity'

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private readonly subject: Repository<Subject>,
    @InjectRepository(User) private readonly user: Repository<User>
  ) {}

  // 新增二级课程
  async create(createSubjectDto: CreateSubjectDto) {
    const subject = new Subject()
    subject.one_key = createSubjectDto.one_key
    subject.two_name = createSubjectDto.two_name
    await this.subject.save(subject)

    return '新增二级课程成功'
  }

  // 获取课程树
  async findAll(req: CustomRequest) {
    const user_id = req.session.user_id
    const user_data = await this.user.findOne({ relations: ['subject'], where: { _id: user_id } })
    const subject_data = await this.subject.find()

    const user_subject = user_data.subject

    const treeData = []
    // 去重过的一级课程
    subject_data.forEach(one_item => {
      if (!treeData.some(tree_item => tree_item.title === one_item.one_key)) {
        treeData.push({
          title: one_item.one_key,
          value: one_item.one_key,
          children: []
        })
      }
    })

    // 完整的树型结构 有一级课程和二级课程，并且和用户的权限进行对比
    treeData.forEach(tree_item => {
      subject_data.forEach(subject_item => {
        // 过滤重复的一级课程
        if (tree_item.title === subject_item.one_key) {
          // 判断用户是否有权限考试
          const can_exam = user_subject.some(user_item => {
            return user_item.two_name === subject_item.two_name
          })
          // 最后添加二级课程
          tree_item.children.push({
            title: subject_item.two_name,
            value: subject_item._id,
            can_exam
          })
        }
      })
    })

    return [...treeData]
  }

  // 删除二级课程
  async remove(id: number) {
    const subject_data = await this.subject.findOne({ where: { _id: id } })
    // remove会触发级联操作 软删除后user和subject的第三张表还是有数据的
    await this.subject.softRemove(subject_data)
    return '删除成功'
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`
  }
}
