import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { ChangeSatusPostUseCase } from './change-status-post.use-case';
import { ChangeStatusPostDto } from '../dtos/change-status-post.dot';
import { PostService } from '../../infrastructure/services/post.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AcceptPostUseCase', () => {
  let useCase: ChangeSatusPostUseCase;
  let repository: jest.Mocked<PostRepository>;

  beforeEach(async () => {
    const mockRepo = {
      getPostById: jest.fn(),
      updatePost: jest.fn(),
    };

    const mockLoggingService = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const mockPostService = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const mockEventEmitter = {
      log: jest.fn(),
      error: jest.fn(),
      emit: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeSatusPostUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: LoggingService, useValue: mockLoggingService },
        { provide: PostService, useValue: mockPostService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<ChangeSatusPostUseCase>(ChangeSatusPostUseCase);
    repository = module.get(PostRepository);
  });

  it('User can set own post as waiting', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'draft', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'writer-id',username: 'writer',role: 'writer',password: 'writer'});
    const input: ChangeStatusPostDto = { status: 'waiting' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post', input, author);

    // Assert
    expect(mockPost.status).toBe('waiting');
    expect(repository.updatePost).toHaveBeenCalled();
  });

  it('Admin should accept post', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'waiting', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const admin = UserEntity.reconstitute({id: 'admin-id',username: 'admin',role: 'admin',password: 'admin'});
    const input: ChangeStatusPostDto = { status: 'accepted' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post', input, admin);

    // Assert
    expect(mockPost.status).toBe('accepted');
    expect(repository.updatePost).toHaveBeenCalled();
  });

  it('Admin can reject post', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'waiting', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const admin = UserEntity.reconstitute({id: 'admin-id',username: 'Bob',role: 'admin',password: 'hash'});
    const input: ChangeStatusPostDto = { status: 'rejected' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post', input, admin);

    // Assert
    expect(mockPost.status).toBe('rejected');
    expect(repository.updatePost).toHaveBeenCalled();
  });

  it('Poster author cannot accept its own post', async () => {
    // Arrange
    const postData = { id: 'post', authorId: '123-writer', status: 'waiting', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const writer = UserEntity.reconstitute({id: '123-writer',username: 'writer',role: 'writer',password: 'writer'});
    const input: ChangeStatusPostDto = { status: 'accepted' };

    repository.getPostById.mockResolvedValue(mockPost);

    // Act
    const result = await useCase.execute('post', input, writer);

    // Assert
    expect(mockPost.status).toBe('waiting');
  });

});