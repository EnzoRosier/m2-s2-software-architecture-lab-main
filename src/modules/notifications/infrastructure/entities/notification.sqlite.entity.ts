import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  link: string;

  @Column()
  isRead: boolean;

  @Column()
  createdAt: Date;

  // @Column({ type: 'simple-json', nullable: true })
  // metadata: {
  //   postId?: string;
  //   comentId?: string;
  //   authorId?: string;
  // };
}
