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
import { CurrentQuiz } from './current-quiz.entity'

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'quiz_id' })
  id: number

  @Column({name: 'is_active_quiz'})
  isActiveQuiz: boolean

  @Column({ name: 'quiz_name' })
  quizName: string

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[]

  @OneToMany(
    () => UserQuizStatus,
    (userQuizStatus) => userQuizStatus.quiz
  )
  userQuizStatus: UserQuizStatus[]

  @ManyToOne(
    () => CurrentQuiz,
    (currentQuiz) => currentQuiz.quiz
  )
  @JoinColumn({name: 'current_quiz_id'})
  currentQuiz: CurrentQuiz
}
