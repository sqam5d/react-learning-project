import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  avatar?: string
  edu: string
  graduation_time: string
  money: string
  name: string
  techStack: string
  vChat: string
  subject_role: string[]
}
