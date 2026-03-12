import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostEntity } from 'src/modules/posts/domain/entities/post.entity';
import { CreateCommentDto } from 'src/modules/posts/application/dtos/create-tags.dto';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreateCommentUseCase } from './create-comment.use-case';
import { CommentService } from 'src/modules/comments/infrastructure/services/comment.service';
import { CommentRepository } from 'src/modules/comments/domain/repositories/Comment.repository';
import { UserCannotCommentException } from '../../domain/exceptions/user-cannot-comment.exception';
import { CreatePostUseCase } from './create-post.use-case';
import { PostService } from '../../infrastructure/services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let repository: jest.Mocked<PostRepository>;
  let service: jest.Mocked<PostService>;

  beforeEach(async () => {
    const mockRepo = {
      createPost: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const mockService = {
      createPost: jest.fn().mockResolvedValue(undefined),
      findBySlug: jest.fn().mockResolvedValue(undefined),
      generateSlug: jest.fn().mockResolvedValue("titre"),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: PostService, useValue: mockService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
    repository = module.get(PostRepository);
    service = module.get(PostService);
  });

  it('Post is created', async () => {

    const author = UserEntity.reconstitute({
      id: 'writer-id',
      username: 'writer',
      role: 'writer',
      password: 'writer',
    });
    const input: CreatePostDto = {
      title: "titre",
      content: "content",
      authorId: "writer-id",
    };

    await useCase.execute(input, author);

    expect(repository.createPost).toHaveBeenCalled();
  });

  it('Post is not created', async () => {

    const author = UserEntity.reconstitute({
      id: 'reader-id',
      username: 'reader',
      role: 'reader',
      password: 'reader',
    });
    const input: CreatePostDto = {
      title: "titre",
      content: "content",
      authorId: "reader-id",
    };

    expect(useCase.execute(input, author)).rejects.toThrow(UserCannotCreatePostException);
  });
});
