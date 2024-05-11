import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";
import { QuestionStatusTypes } from "../interfaces/common.interfaces";
import { UserQuestionStatus } from "./user-question-status.entity";
import { QuestionAnswer } from "./question-answer.entity";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn({name: 'question_id'})
  id: number

  @Column({ type: 'text' })
  question: string 
  
  @Column({type: 'text', name: 'question_status'})
  questionStatus: QuestionStatusTypes

  @Column({ name: 'question_number'})
  questionNumber: number
  
  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({name: 'quiz_id'})
  quiz: Quiz

  @OneToMany(
  () => QuestionAnswer, 
  (questionAnswer) => questionAnswer.question
  )
  questionAnswer: QuestionAnswer[]

  @OneToMany(
    () => UserQuestionStatus,
    (userQuestionStatus) => userQuestionStatus.question
  )
  userQuestionStatus: UserQuestionStatus[]
}
