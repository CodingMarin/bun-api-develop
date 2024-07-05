import { BunRequest } from 'bunrest/src/server/request'
import { BunResponse } from 'bunrest/src/server/response'
import server from 'bunrest'

export type BunServer = ReturnType<typeof server>

export type Router = ReturnType<ReturnType<typeof server>['router']>

export type HandlerWithSub = (
  req: BunRequest,
  res: BunResponse,
  sub?: string
) => void | Promise<any>
