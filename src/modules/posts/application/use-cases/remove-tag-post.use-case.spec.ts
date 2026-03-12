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
import { RemoveTagPostUseCase } from './remove-tag-post.use-case';
import { TagService } from 'src/modules/tags/infrastructure/services/tag.service';
import { TagEntity } from 'src/modules/tags/domain/entities/tags.entity';
import { UserCannotUpdatePostTagsException } from '../../domain/exceptions/user-cannot-update-post-tags.exception';

describe('RemoveTagPostUseCase', () => {
  let useCase: RemoveTagPostUseCase;
  let repository: jest.Mocked<PostRepository>;
  let tagService: jest.Mocked<TagService>;

  beforeEach(async () => {
    const mockRepo = {
      getPostById: jest.fn(),
      removeTag: jest.fn(),
    };

    const mockTagService = {
      getTagById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveTagPostUseCase,
        { provide: PostRepository, useValue: mockRepo },
        { provide: TagService, useValue: mockTagService },
      ],
    }).compile();

    useCase = module.get<RemoveTagPostUseCase>(RemoveTagPostUseCase);
    repository = module.get(PostRepository);
    tagService = module.get(TagService);
  });

  it('User can delete tag on its own post', async () => {
    // Arrange
    const tagData = {id: "tag_id", name: "supertag",createdAt: new Date(Date.now())}
    const mockTag = TagEntity.reconstitute(tagData);
    const postData = {
      id: 'post',
      authorId: 'writer-id',
      status: 'accepted',
      title: 'super title',
      content: 'content',
      slug: 'super-title',
      tags: [mockTag.toJSON()],
    };
    const mockPost = PostEntity.reconstitute(postData);
    
    const user = UserEntity.reconstitute({
      id: 'writer-id',
      username: 'writer',
      role: 'writer',
      password: 'writer',
    });

    repository.getPostById.mockResolvedValue(mockPost);
    tagService.getTagById.mockResolvedValue(mockTag);
    repository.removeTag.mockResolvedValue(undefined);

    await useCase.execute(mockPost.id,mockTag.id, user);

    expect(repository.removeTag).toHaveBeenCalled();
  });

  it('Admin can delete tag on ohers posts', async () => {
    // Arrange
    const tagData = {id: "tag_id", name: "supertag",createdAt: new Date(Date.now())}
    const mockTag = TagEntity.reconstitute(tagData);
    const postData = {
      id: 'post',
      authorId: 'writer-id',
      status: 'accepted',
      title: 'super title',
      content: 'content',
      slug: 'super-title',
      tags: [mockTag.toJSON()],
    };
    const mockPost = PostEntity.reconstitute(postData);
    
    const user = UserEntity.reconstitute({
      id: 'admin-id',
      username: 'admin',
      role: 'admin',
      password: 'admin',
    });

    repository.getPostById.mockResolvedValue(mockPost);
    tagService.getTagById.mockResolvedValue(mockTag);
    repository.removeTag.mockResolvedValue(undefined);

    await useCase.execute(mockPost.id,mockTag.id, user);

    expect(repository.removeTag).toHaveBeenCalled();
  });

  it('Others cannot delete tag on ohers posts', async () => {
    // Arrange
    const tagData = {id: "tag_id", name: "supertag",createdAt: new Date(Date.now())}
    const mockTag = TagEntity.reconstitute(tagData);
    const postData = {
      id: 'post',
      authorId: 'writer-id',
      status: 'accepted',
      title: 'super title',
      content: 'content',
      slug: 'super-title',
      tags: [mockTag.toJSON()],
    };
    const mockPost = PostEntity.reconstitute(postData);
    
    const user = UserEntity.reconstitute({
      id: 'reader-id',
      username: 'reader',
      role: 'reader',
      password: 'reader',
    });

    repository.getPostById.mockResolvedValue(mockPost);
    tagService.getTagById.mockResolvedValue(mockTag);
    repository.removeTag.mockResolvedValue(undefined);

    expect(useCase.execute(mockPost.id,mockTag.id, user)).rejects.toThrow(UserCannotUpdatePostTagsException);

    expect(repository.removeTag).not.toHaveBeenCalled();
  });
});
