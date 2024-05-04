import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Question } from './question.entity'
import { UserQuizStatus } from './user-quiz-status.entity'

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'quiz_id' })
  id: number

  @Column()
  status: boolean

  @Column({ name: 'quiz_name' })
  quizName: string

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[]

  @OneToMany(
    () => UserQuizStatus,
    (userQuizStatus) => userQuizStatus.quiz
  )
  userQuizStatus: UserQuizStatus[]
}
