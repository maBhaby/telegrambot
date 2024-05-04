import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RegistrationStatusTypes } from "../interfaces/user.interfaces";
import { UserQuizStatus } from "./user-quiz-status.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({name: 'user_id'})
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

  @OneToMany(
    () => UserQuizStatus,
    (userQuizStatus) => userQuizStatus.user
  )
  userQuizStatus: UserQuizStatus[]

  constructor(user: Partial<User>) {
    super()
    Object.assign(this, user)
  }
}
