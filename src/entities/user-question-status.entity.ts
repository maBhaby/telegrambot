import { Entity, Column, JoinTable, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";

@Entity()
export class UserQuestionStatus {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'question_id' })
  quizId: number

  @Column({name: 'question_status', type: 'text'})
  status: string

  @ManyToOne(
    () => User,
    (user) => user.userQuestionStatus  
  )
  @JoinTable({name: 'user_id'})
  user: User

  @ManyToOne(
    () => Question,
    (question) => question.userQuestionStatus
  )
  @JoinTable({name: 'question_id'})
  question: Question
}
