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
import { DeleteCommentUseCase } from 'src/modules/comments/application/use-cases/delete-comment.use-case';
import { CommentEntity } from 'src/modules/comments/domain/entities/comment.entity';
import { UserCannotUpdateCommentException } from 'src/modules/comments/domain/exceptions/user-cannot-update-comment.exception';

describe('DeleteCommentUseCase', () => {
  let useCase: DeleteCommentUseCase;
  let repository: jest.Mocked<PostRepository>;
  let commentService: jest.Mocked<CommentService>;
  let commentRepository: jest.Mocked<CommentRepository>;

  beforeEach(async () => {
    const mockRepo = {
      getPostById: jest.fn(),
    };

    const mockCommentRepository = {
      deleteComment: jest.fn().mockResolvedValue(undefined),
      getCommentById: jest.fn()
    };

    const mockCommentService = {
      createComment: jest.fn().mockResolvedValue(undefined),
    };

    const mockEventEmitter = {
      emit: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCommentUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: CommentRepository, useValue: mockCommentRepository },
        { provide: CommentService, useValue: mockCommentService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<DeleteCommentUseCase>(DeleteCommentUseCase);
    repository = module.get(PostRepository);
    commentService = module.get(CommentService)
    commentRepository = module.get(CommentRepository)
  });

  it('User can delete its own comment', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'accepted', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader-id',username: 'reader',role: 'reader',password: 'reader'});
    const commentData = { id: 'comment', authorId: 'reader-id', postId: 'post', content: 'content', author: author, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()) };
    const mockComment = CommentEntity.reconstitute(commentData);

    repository.getPostById.mockResolvedValue(mockPost);
    commentRepository.getCommentById.mockResolvedValue(mockComment);

    await useCase.execute(mockPost.id, author);

    expect(commentRepository.deleteComment).toHaveBeenCalled();
  });

  it('Admin can delete others comment', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'accepted', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader-id',username: 'reader',role: 'reader',password: 'reader'});
    const admin = UserEntity.reconstitute({id: 'admin-id',username: 'admin',role: 'admin',password: 'admin'});
    const commentData = { id: 'comment', authorId: 'reader-id', postId: 'post', content: 'content', author: author, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()) };
    const mockComment = CommentEntity.reconstitute(commentData);

    repository.getPostById.mockResolvedValue(mockPost);
    commentRepository.getCommentById.mockResolvedValue(mockComment);

    await useCase.execute(mockPost.id, admin);

    expect(commentRepository.deleteComment).toHaveBeenCalled();
  });

  it('Poster can delete others comment', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'accepted', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader-id',username: 'reader',role: 'reader',password: 'reader'});
    const writer = UserEntity.reconstitute({id: 'writer-id',username: 'writer',role: 'writer',password: 'writer'});
    const commentData = { id: 'comment', authorId: 'reader-id', postId: 'post', content: 'content', author: author, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()) };
    const mockComment = CommentEntity.reconstitute(commentData);

    repository.getPostById.mockResolvedValue(mockPost);
    commentRepository.getCommentById.mockResolvedValue(mockComment);

    await useCase.execute(mockPost.id, writer);

    expect(commentRepository.deleteComment).toHaveBeenCalled();
  });

  it('Random people cannot delete others comment', async () => {
    // Arrange
    const postData = { id: 'post', authorId: 'writer-id', status: 'accepted', title: 'super title', content: 'content', slug: 'super-title', tags: [] };
    const mockPost = PostEntity.reconstitute(postData);
    const author = UserEntity.reconstitute({id: 'reader-id',username: 'reader',role: 'reader',password: 'reader'});
    const reader2 = UserEntity.reconstitute({id: 'reader2-id',username: 'reader2',role: 'reader',password: 'reader2'});
    const commentData = { id: 'comment', authorId: 'reader-id', postId: 'post', content: 'content', author: author, createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()) };
    const mockComment = CommentEntity.reconstitute(commentData);

    repository.getPostById.mockResolvedValue(mockPost);
    commentRepository.getCommentById.mockResolvedValue(mockComment);

    expect(useCase.execute(mockPost.id, reader2)).rejects.toThrow(UserCannotUpdateCommentException);

    expect(commentRepository.deleteComment).not.toHaveBeenCalled();
  });
});