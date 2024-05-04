import { type } from 'os'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Quiz } from './quiz.entity'
import { User } from './user.entity'
@Entity()
export class UserQuizStatus extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'quiz_id' })
  quizId: number

  @Column({ name: 'quiz_status', type: 'text' })
  status: string

  // @Column(name: 'current_question')
  // question: string

  @ManyToOne(() => Quiz, (quiz) => quiz.userQuizStatus)
  @JoinColumn({name: 'quiz_id'})
  quiz: Quiz

  @ManyToOne(() => User, (user) => user.userQuizStatus)
  @JoinColumn({name: 'user_id'})
  user: User
}
