import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class QuestionAnswer extends BaseEntity {
  @PrimaryGeneratedColumn({name: 'question_answer_id'})
  id: number

  @Column()
  text: string

  @ManyToOne(() => Question, (question) => question.questionAnswer)
  @JoinColumn({name: 'question_id'})
  question: Question

  @Column({name: 'is_correct'})
  isCorrect: boolean
}
