import { Entity, Column, JoinTable, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Question } from "./question.entity";

@Entity()
export class UserQuestionStatus {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'question_id' })
  questionId: number

  @Column({name: 'question_status', type: 'text'})
  status: 'active' | 'answered'

  @Column({name: 'is_correct_answer', nullable: true})
  isCorrectAnswer: boolean

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
