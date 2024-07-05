import 'reflect-metadata'
import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const config = {
  type: 'postgres',
  host: DB_HOST ?? 'localhost',
  port: Number(DB_PORT) || 5432,
  username: DB_USERNAME ?? 'root',
  password: DB_PASSWORD ?? '123456',
  database: DB_NAME ?? 'test',
  // These fields are to setup the database at the start
  synchronize: true,
  dropSchema: true,
  entities: [join(import.meta.dir + '/../**/*.entity.{js,ts}')],
  logging: false,
  ssl: false,
  autoLoadEntities: true,
}

export const dataSource = new DataSource(<DataSourceOptions>config)

export const initializeDatabase = async () => {
  try {
    const ds = await dataSource.initialize()

    console.log('Successfully connected: ', ds.isInitialized)
  } catch (error) {
    console.log(error)
  }
}
