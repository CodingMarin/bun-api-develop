import { BunRequest } from 'bunrest/src/server/request'
import { BunResponse } from 'bunrest/src/server/response'
import { UserService } from '../../services'
import { User } from '../../entities'

export const signupHandler = async (req: BunRequest, res: BunResponse) => {
  const data = req.body || {}
  const result = await UserService.signup(<User>data)
  res.status(200).json(result)
}

export const loginHandler = async (req: BunRequest, res: BunResponse) => {
  const { email, password } = req.body || {}

  const result = await UserService.login(email, password)

  res.status(200).json(result)
}

export const changePasswordHandler = async (req: BunRequest, res: BunResponse) => {
  const { email, oldPassword, newPassword } = req.body || {}

  const result = await UserService.changePassword(email, oldPassword, newPassword)

  res.status(200).json(result)
}

export const getAllUsersHandler = async (_: BunRequest, res: BunResponse) => {
  const result = await UserService.getUsers()

  res.status(200).json(result)
}

export const getUserHandler = async (req: BunRequest, res: BunResponse) => {
  const id = req.params?.id
  const result = await UserService.getUserById(id)

  res.status(200).json(result)
}

export const updateUserHandler = async (req: BunRequest, res: BunResponse) => {
  const id = req.params?.id
  const data = req.body || {}

  const result = await UserService.updateUser(id, <Partial<User>>data)

  res.status(200).json(result)
}

export const deleteUserHandler = async (req: BunRequest, res: BunResponse) => {
  const id = req.params?.id
  const result = await UserService.deleteUser(id)

  res.status(200).json(result)
}
