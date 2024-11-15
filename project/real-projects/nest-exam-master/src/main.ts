import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import { TransformInterceptor } from './interceptor/formData'
import { HttpFilter } from './filters/httpfilter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 配置session中间件
  app.use(session({ secret: 'yu_jian_key', resave: false, rolling: true, saveUninitialized: false, name: 'yu.sid' }))
  app.useGlobalInterceptors(new TransformInterceptor())
  // app.useGlobalFilters(new HttpFilter())

  await app.listen(3333)
}
bootstrap()
