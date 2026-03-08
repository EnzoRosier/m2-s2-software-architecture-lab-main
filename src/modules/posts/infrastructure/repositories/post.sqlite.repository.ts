import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async addTag(id: string, idTag: string) {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder()
      .relation(SQLitePostEntity, 'tags')
      .of(id)
      .add(idTag);
  }

  public async removeTag(id: string, idTag: string) {
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder()
      .relation(SQLitePostEntity, 'tags')
      .of(id)
      .remove(idTag);
  }

  public async getPosts(
    tagsIds: string[],
    user: UserEntity,
  ): Promise<PostEntity[]> {
    // var data
    // if (!user) {
    //   data = await this.dataSource
    //     .getRepository(SQLitePostEntity)
    //     .find({
    //       where: {
    //         tags: {
    //           id: In(tagsIds)
    //         }
    //       },
    //       relations: { tags: true } });
    // }

    // if (user.permissions.posts.canReadAllPosts()) {

    // }
    // if (tagsIds.length > 0) {
    //   data = await this.dataSource
    //     .getRepository(SQLitePostEntity)
    //     .find({
    //       where: {
    //         tags: {
    //           id: In(tagsIds)
    //         }
    //       },
    //       relations: { tags: true } });
    // } else {
    //   data = await this.dataSource
    //     .getRepository(SQLitePostEntity)
    //     .find({ relations: { tags: true } });

    // }

    const query = this.dataSource
      .getRepository(SQLitePostEntity)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag');

    // 1. Filtre par Tags (si présents)
    if (tagsIds.length > 0) {
      query.andWhere('tag.id IN (:...ids)', { ids: tagsIds });
    }

    if (!user ||!user.permissions.posts.canReadAllPosts()) {
      if (user) {
        // Pour un utilisateur connecté : (Statut Accepté OU Je suis l'auteur)
        query.andWhere('(post.status = :status OR post.authorId = :userId)', {
          status: 'accepted',
          userId: user.id,
        });
      } else {
        // Pour un anonyme : Uniquement les posts acceptés
        query.andWhere('post.status = :status', { status: 'accepted' });
      }
    }

    const data = await query.getMany();

    return data.map((post) => PostEntity.reconstitute({ ...post }));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id }, relations: { tags: true } });

    return post ? PostEntity.reconstitute({ ...post }) : undefined;
  }

  public async createPost(input: PostEntity): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).save(input.toJSON());
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    var postJson = input.toJSON()
    delete postJson.tags
    await this.dataSource
      .getRepository(SQLitePostEntity)
      .update(id, postJson);
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }
}
