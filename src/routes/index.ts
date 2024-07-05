import setUserRoutes from './user/user.routes'
import { BunServer } from '../types'

export const buildRouter = (app: BunServer) => {
  setUserRoutes(app)
}
