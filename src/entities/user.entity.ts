import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RegistrationStatusTypes } from "../interfaces/user.interfaces";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'telegram_id'})
  telegramId: number

  @Column({name: 'chat_id'})
  chatId: number

  @Column({name: 'full_name'})
  fullName: string

  @Column()
  company: string

  @Column({
    name: 'registration_status', 
    type: 'text'
  })
  registrationStatus: RegistrationStatusTypes

  constructor(user: Partial<User>) {
    super()
    Object.assign(this, user)
  }
}
