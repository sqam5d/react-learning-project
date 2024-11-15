import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

// 统一成功响应的数据结构
export interface SuccessResponse<T> {
  code: number
  msg: string
  data: T
}

// 统一响应的数据结构
export interface ErrorResponse {
  code: number
  msg: string
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next.handle().pipe(map(data => ({ code: 200, msg: 'success', data })))
  }
}

// 分页的数据
@Injectable()
export class PageTransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next.handle().pipe(map(data => ({ code: 200, msg: 'success', data })))
  }
}
