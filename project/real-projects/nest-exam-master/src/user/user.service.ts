import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { Role } from 'src/role/role.enum'
import { LoginBody } from './dto/login-user.dto'
import { CustomRequest } from 'src/type'
import { getMenu } from 'src/menu'
import { Subject } from 'src/subject/entities/subject.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Subject) private readonly subject: Repository<Subject>
  ) {}

  // 登录
  async login(body: LoginBody, req: CustomRequest) {
    const role = Role.student

    const user_data = await this.user.findOne({ where: { phone: body.phone } })

    // 已注册
    if (user_data) {
      // 设置session信息
      req.session.login = 1
      req.session.phone = body.phone
      req.session.user_id = user_data._id
      req.session.role = user_data.role
    } else {
      // 未注册，创建用户信息并设置session信息
      const new_user = await this.user.create({ phone: body.phone, role })
      await this.user.save(new_user)
      req.session.login = 1
      req.session.phone = body.phone
      req.session.user_id = new_user._id
      req.session.role = new_user.role
    }

    console.log('写入session成功', req.session)

    return {
      session: req.session
    }
  }

  // 退出
  logout(req: CustomRequest) {
    req.session.login = null
    req.session.phone = null
    req.session.user_id = null
    req.session.role = null

    return {
      session: req.session
    }
  }

  // 注册或者修改个人信息   ||| 学员管理的课程权限编辑
  async update(id: number, updateUserDto: UpdateUserDto, req: CustomRequest) {
    // 学员管理的课程权限编辑
    if (updateUserDto.subject_role) {
      // 用到了事务，因为涉及到了两张表
      this.user.manager.transaction(async manager => {
        const user_data = await manager.findOne(User, { relations: ['subject'], where: { _id: Number(id) } })
        const subject_role = updateUserDto.subject_role
        const subjectList = []
        console.log(`课程权限 =============》${subject_role}`)

        // 如果是数组
        if (Array.isArray(subject_role)) {
          // 从subject表中一个一个找
          subject_role.forEach(async item => {
            const subject = await manager.findOne(Subject, { where: { _id: Number(item) } })
            subjectList.push(subject)
          })
        } else {
          // 如果是单个值
          const subject = await manager.findOne(Subject, { where: { _id: Number(subject_role) } })
          subjectList.push(subject)
        }

        // 然后在对应的user上添加
        user_data.subject = subjectList as Subject[]
        await manager.save(User, user_data)
      })
      return '修改课程权限成功'
    } else {
      // 注册或者修改个人信息
      const res = await this.user.update({ _id: id }, { ...updateUserDto, has_person_info: true })
      if (res.affected == 1) {
        // ？？？？可能要修改
        const user_data = await this.user.findOne({ where: { _id: id } })
        // console.log(`11111111111${user_data}`)
        req.session.role = user_data.role
        return '修改成功'
      } else {
        throw new HttpException('修改失败', HttpStatus.FORBIDDEN)
      }
    }
  }

  // 获取用户信息
  async findUser(req: CustomRequest) {
    const user_id = req.session.user_id
    const user_data = await this.user.findOne({ relations: ['subject'], where: { _id: user_id } })
    const subject_role = user_data.subject
    user_data.subject = subject_role.map(item => item._id) as any

    return user_data
  }

  // 查找菜单
  findMenu(req: CustomRequest) {
    const role = req.session.role as keyof typeof Role
    return getMenu(role)
  }

  // 获取学生列表
  async getStudent(query) {
    const student_list = await this.user.find({ relations: ['subject'], where: { role: Role.student, name: Like(`%${query.name}%`), phone: Like(`%${query.phone}%`) }, skip: (query.pageNo - 1) * query.pageSize, take: query.PageSize })

    const total = await this.user.count({ where: { role: Role.student, name: Like(`%${query.name}%`), phone: Like(`%${query.phone}%`) } })
    // 将subject(二级课程权限)改成id
    const handle_student_list = student_list.map(stu_item => {
      return {
        ...stu_item,
        subject: stu_item.subject.map(item => item._id)
      }
    })

    return { count: total, data: [...handle_student_list] }
  }

  // 新增管理员
  async addAdmin(createUserDto: CreateUserDto) {
    const admin_data = { ...createUserDto, role: 'admin' }
    const admin = await this.user.create(admin_data)
    await this.user.save(admin)

    return '新增管理员成功'
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  findOne(id: number) {
    // throw new HttpException(`未找到${id}`, HttpStatus.FORBIDDEN)
    // throw new NotFoundException(`未找到${id}`)
    return `This action returns a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
