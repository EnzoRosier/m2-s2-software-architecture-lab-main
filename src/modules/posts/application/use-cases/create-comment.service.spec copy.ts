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

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;
  let repository: jest.Mocked<PostRepository>;
  let commentService: jest.Mocked<CommentService>;
  let commentRepository: jest.Mocked<CommentRepository>;

  beforeEach(async () => {
    const mockRepo = {
      getPostById: jest.fn(),
    };

    const mockCommentRepository = {
      createComment: jest.fn().mockResolvedValue(undefined),
    };

    const mockCommentService = {
      createComment: jest.fn().mockResolvedValue(undefined),
    };

    const mockEventEmitter = {
      emit: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: CommentRepository, useValue: mockCommentRepository },
        { provide: CommentService, useValue: mockCommentService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<CreateCommentUseCase>(CreateCommentUseCase);
    repository = module.get(PostRepository);
    commentService = module.get(CommentService)
    commentRepository = module.get(CommentRepository)
  });

  it('User can create comment on accepted post', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'accepted', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader',username: 'reader',role: 'reader',password: 'reader'});
    const input: CreateCommentDto = { content: 'content' };

    repository.getPostById.mockResolvedValue(mockPost);

    await useCase.execute(input, author, mockPost.id);

    expect(commentService.createComment).toHaveBeenCalled();
  });

  it('User cannot create comment on waiting post', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'waiting', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader',username: 'reader',role: 'reader',password: 'reader'});
    const input: CreateCommentDto = { content: 'content' };

    repository.getPostById.mockResolvedValue(mockPost);

    expect(useCase.execute(input, author, mockPost.id)).rejects.toThrow(UserCannotCommentException)

    expect(commentService.createComment).not.toHaveBeenCalled();
  });


});