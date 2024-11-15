import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    console.log('触发登录中间件', req.session)

    if (!req.session || !req.session.login) {
      return res.json({
        code: 401,
        msg: '未登录'
      })
    }
    next()
  }
}
