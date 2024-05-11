import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Question } from './question.entity'
import { UserQuizStatus } from './user-quiz-status.entity'

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'quiz_id' })
  id: number

  @Column({name: 'is_active_quiz'})
  isActiveQuiz: boolean

  @Column({ name: 'quiz_name' })
  quizName: string

  @Column({name: 'start_date'})
  startDate: string

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[]

  @OneToMany(
    () => UserQuizStatus,
    (userQuizStatus) => userQuizStatus.quiz
  )
  userQuizStatus: UserQuizStatus[]
}
