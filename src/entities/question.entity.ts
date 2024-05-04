import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";
import { QuestionStatusTypes } from "../interfaces/common.interfaces";
import { UserQuestionStatus } from "./user-question-status.entity";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn({name: 'question_id'})
  id: number

  @Column({ type: 'text' })
  question: string | null

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({name: 'quiz_id'})
  quiz: Quiz

  @Column({type: 'text', name: 'question_status'})
  questionStatus: QuestionStatusTypes

  @OneToMany(
    () => UserQuestionStatus,
    (userQuestionStatus) => userQuestionStatus.question
  )
  userQuestionStatus: UserQuestionStatus[]
}
