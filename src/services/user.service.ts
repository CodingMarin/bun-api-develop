import { User } from '../entities'
import { dataSource } from '../config'
import { cleanObject, CustomError } from '../utils'
import { JwtService } from './shared/jwt.service'
import bcrypt from 'bcryptjs'

export default class UserService extends JwtService {
  private static readonly repository = dataSource.getRepository(User)

  static signup = async ({
    email,
    password,
    username,
    country,
    phone,
    privacyOptIn,
  }: User) => {
    try {
      const user = await this.getUserByEmail(email)
      if (user)
        throw new CustomError('Oops seems like this email is already in use.', 400)

      if (!privacyOptIn)
        throw new CustomError('User must accept privacy opt in', 400)

      const newUser = new User()
      newUser.email = email
      newUser.password = password
      newUser.username = username
      newUser.country = country
      newUser.phone = phone
      newUser.privacyOptIn = privacyOptIn

      await this.repository.save(newUser)

      return { message: 'User successfully registered' }
    } catch (error) {
      console.log('Signup error, reason: ', error.message)
      throw error
    }
  }

  static login = async (email: string, password: string) => {
    try {
      if (!email || !password) throw new CustomError('Missing information', 400)

      const user = await this.getUserByEmail(email)

      if (!user) throw new CustomError('Does not have access', 401)

      if (!bcrypt.compareSync(password, user.password))
        throw new CustomError('Invalid password', 400)

      const accessToken = this.signToken(user.id)

      return { accessToken }
    } catch (error) {
      console.log('Login error, reason: ', error.message)
      throw error
    }
  }

  static changePassword = async (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      if (!email || !oldPassword || !newPassword)
        throw new CustomError('Missing information', 400)

      const user = await this.getUserByEmail(email)

      if (!user) throw new CustomError('Does not have access', 401)

      if (!bcrypt.compareSync(oldPassword, user.password))
        throw new CustomError('Invalid old password', 400)

      user.password = newPassword
      await this.repository.save(user)

      return { message: 'Password changed successfully' }
    } catch (error) {
      console.log('Change password error, reason: ', error.message)
      throw error
    }
  }

  static getUsers = async () => {
    try {
      const users = await this.repository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.country',
          'user.coins',
          'user.phone',
        ])
        .where('user.deletedAt IS NULL')
        .getMany()

      return { users }
    } catch (error) {
      console.log('Get all users error, reason: ', error.message)
      throw error
    }
  }

  static updateUser = async (
    id: string,
    { username, country, phone, coins }: Partial<User>
  ) => {
    try {
      const { user } = await this.getUserById(id)

      if (!user) throw new CustomError('User not found', 404)

      await this.repository
        .createQueryBuilder()
        .update(User)
        .set(
          cleanObject({
            username,
            country,
            phone,
            coins,
          })
        )
        .where('id = :id', { id })
        .execute()

      return { message: 'User successfully updated' }
    } catch (error) {
      console.log('Update user error, reason: ', error.message)
      throw error
    }
  }

  static deleteUser = async (id: string) => {
    try {
      const { user } = await this.getUserById(id)

      if (!user) throw new CustomError('User not found', 404)

      await this.repository.softDelete(id)

      return { message: 'User successfully deleted' }
    } catch (error) {
      console.log('Delete user error, reason: ', error.message)
      throw error
    }
  }

  static getUserById = async (id: string) => {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.country',
          'user.coins',
          'user.phone',
        ])
        .where('user.deletedAt IS NULL AND user.id = :id', { id })
        .getOne()

      return { user }
    } catch (error) {
      console.log('Get user by id error, reason: ', error.message)
      throw error
    }
  }

  private static getUserByEmail = async (email: string) =>
    await this.repository.findOne({ where: { email } })
}
