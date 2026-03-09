import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { TagEntity } from 'src/modules/tags/domain/entities/tags.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tags.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: PostStatus;

  @Column()
  authorId: string;

  @Column({nullable:true})
  slug: string;

  @ManyToMany(() => SQLiteTagEntity, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag_id',
    joinColumn: {
      name: 'post',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];
}
