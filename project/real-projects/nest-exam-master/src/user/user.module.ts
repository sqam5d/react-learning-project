import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Subject } from 'src/subject/entities/subject.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Subject])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
