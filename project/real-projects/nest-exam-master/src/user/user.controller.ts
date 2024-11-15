import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginBody } from './dto/login-user.dto'
import { CustomRequest } from 'src/type'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 登录
  @Post('login')
  login(@Body() body: LoginBody, @Request() req: CustomRequest) {
    return this.userService.login(body, req)
  }

  // 退出
  @Post('logout')
  logout(@Request() req: CustomRequest) {
    return this.userService.logout(req)
  }

  // 获取用户信息
  @Get()
  findUser(@Request() req) {
    return this.userService.findUser(req)
  }

  // 获取菜单
  @Get('menu')
  findMenu(@Request() req) {
    return this.userService.findMenu(req)
  }

  // 注册或者修改信息
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.update(+id, updateUserDto, req)
  }

  // 获取学生列表
  @Get('student')
  getStudent(@Query() query: { name?: string; phone: string; pageNo: number; PageSize: number }) {
    return this.userService.getStudent(query)
  }

  // 新增管理员
  @Post('add_admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.addAdmin(createUserDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
