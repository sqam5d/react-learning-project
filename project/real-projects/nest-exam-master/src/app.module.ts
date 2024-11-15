import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TopicModule } from './topic/topic.module'
import { SubjectModule } from './subject/subject.module'
import { ExamModule } from './exam/exam.module'
import { LoggerMiddleware } from './middleware/login'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      username: 'root', //账号
      password: 'yujian0923', //密码
      host: 'localhost', //host
      port: 13306, //
      database: 'exam', //库名
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true
    }),
    TopicModule,
    SubjectModule,
    ExamModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        {
          path: 'user/login',
          method: RequestMethod.ALL
        },
        {
          path: 'user/logout',
          method: RequestMethod.ALL
        }
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
  }
}
