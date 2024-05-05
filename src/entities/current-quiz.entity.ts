import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { Quiz } from './quiz.entity'

@Entity()
export class CurrentQuiz extends BaseEntity {
  @PrimaryColumn({ name: 'current_quiz_id' })
  id: number

  @Column({name: 'current_quiz_name', type: 'text'})
  name: string 

  @Column({name: 'current_quiz_active_count'})
  activeCount: number

  @OneToMany(() => Quiz, (quiz) => quiz.currentQuiz)
  quiz: Quiz[]

  constructor(val: Partial<CurrentQuiz>) {
    super()
    Object.assign(this, val)
  }
}
