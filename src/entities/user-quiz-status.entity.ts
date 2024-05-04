import { type } from 'os'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Quiz } from './quiz.entity'
import { User } from './user.entity'

export class UserQuizStatus extends BaseEntity {
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
