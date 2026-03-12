import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SQLitePostEntity } from './modules/posts/infrastructure/entities/post.sqlite.entity';
import { SQLiteUserEntity } from './modules/users/infrastructure/entities/user.sqlite.entity';
import { PostEntity } from './modules/posts/domain/entities/post.entity';
import { UserEntity } from './modules/users/domain/entities/user.entity';
import { SQLiteTagEntity } from './modules/tags/infrastructure/entities/tags.sqlite.entity';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [SQLitePostEntity, SQLiteUserEntity, SQLiteTagEntity],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(SQLiteUserEntity);
    const postRepo = dataSource.getRepository(SQLitePostEntity);
    const tagRepo = dataSource.getRepository(SQLiteTagEntity);

    await postRepo.clear();
    await userRepo.clear();
    await tagRepo.clear();

    console.log('Reset database');

    const rawUsers = [
      {
        id: uuidv4(),
        username: 'reader',
        role: 'reader' as const,
        password: 'reader',
      },
      {
        id: uuidv4(),
        username: 'moderator',
        role: 'moderator' as const,
        password: 'moderator',
      },
      {
        id: uuidv4(),
        username: 'writer',
        role: 'writer' as const,
        password: 'writer',
      },

      {
        id: uuidv4(),
        username: 'admin',
        role: 'admin' as const,
        password: 'admin',
      },
    ];

    const savedUsers: UserEntity[] = [];

    for (const raw of rawUsers) {
      const userDomain = UserEntity.reconstitute(raw);
      await userRepo.save(userDomain.toJSON());
      savedUsers.push(userDomain);
      console.log(`New User : ${userDomain.toJSON().username}`);
    }
    console.log(savedUsers[1].toJSON().username);
    const writer = savedUsers[1];

    const rawPosts = [
      {
        id: uuidv4(),
        title: 'Super Draft Article',
        content: 'content',
        authorId: writer.id,
        status: 'draft' as const,
        slug: 'draft-article',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Super Waiting Article',
        content: 'content',
        authorId: writer.id,
        status: 'waiting' as const,
        slug: 'waiting-article',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Super Accepted Article',
        content: 'content',
        authorId: writer.id,
        status: 'accepted' as const,
        slug: 'accepted-article',
        tags: [],
      },
      {
        id: uuidv4(),
        title: 'Super Rejected Article',
        content: 'content',
        authorId: writer.id,
        status: 'rejected' as const,
        slug: 'rejected-article',
        tags: [],
      },
    ];

    for (const raw of rawPosts) {
      const postDomain = PostEntity.reconstitute(raw);
      await postRepo.save(postDomain.toJSON());
      console.log(`New post : ${postDomain.toJSON().title}`);
    }

    console.log('Finished seeding');
  } catch (error) {
    console.error('Error', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();
