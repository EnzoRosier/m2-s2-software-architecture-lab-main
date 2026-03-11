import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { UserEntity, type UserRole } from '../../domain/entities/user.entity';

@Entity('users')
export class SQLiteUserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  role: UserRole;

  @Column()
  password: string;
}
