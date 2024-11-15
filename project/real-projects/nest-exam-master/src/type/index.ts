import { Request } from 'express'

export interface Session {
  cookie: object
  login: number
  role: string
  phone: string
  user_id: number
}

export interface CustomRequest extends Request {
  session: Session
}
