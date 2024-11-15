import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common'

import { Request, Response } from 'express'

// 异常过滤器
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    const status = exception.getStatus()

    res.status(status).json({
      data: exception.message,
      time: new Date(),
      msg: 'fail',
      path: req.url,
      code: status
    })
  }
}
