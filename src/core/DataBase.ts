import { resolve } from "path";
import { DataSource } from "typeorm";
import { root } from "../config/commons";

export class DataBaseProvider {
  private appDataSource: DataSource

  constructor () {
    this.appDataSource = new DataSource({
      type: 'sqlite',
      database: `${root}/database/db.sqlite`,
      synchronize: true,
      entities: [resolve(__dirname, "../", "entities", "*.entity.[t|j]s")],
      // migrations: [resolve(__dirname, "../", "database", "migrations", "*.[t|j]s")],
      logging: true
    })
  }

  public getDB() {
    return this.appDataSource
  }
}
