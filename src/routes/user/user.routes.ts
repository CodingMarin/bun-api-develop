import { BunServer } from '../../types'
import { ErrorHandlerWrapper, AuthorizationWrapper } from '../../utils'
import * as handlers from './user.handlers'

const setUserRoutes = (app: BunServer) => {
  app.post('/signup', ErrorHandlerWrapper(handlers.signupHandler))

  app.post('/login', ErrorHandlerWrapper(handlers.loginHandler))

  app.patch('/change-password', ErrorHandlerWrapper(handlers.changePasswordHandler))

  app.get(
    '/users',
    ErrorHandlerWrapper(AuthorizationWrapper(handlers.getAllUsersHandler))
  )

  app.get(
    '/users/:id',
    ErrorHandlerWrapper(AuthorizationWrapper(handlers.getUserHandler))
  )

  app.patch(
    '/users/:id',
    ErrorHandlerWrapper(AuthorizationWrapper(handlers.updateUserHandler))
  )

  app.delete(
    '/users/:id',
    ErrorHandlerWrapper(AuthorizationWrapper(handlers.deleteUserHandler))
  )
}

export default setUserRoutes
