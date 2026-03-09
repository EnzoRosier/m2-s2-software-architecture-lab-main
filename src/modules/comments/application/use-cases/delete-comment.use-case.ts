import { Inject, Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentRepository } from '../../domain/repositories/Comment.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CreateCommentDto } from 'src/modules/posts/application/dtos/create-tags.dto';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { UserCannotUpdateCommentException } from '../../domain/exceptions/user-cannot-update-comment.exception';
import { PostRepository } from 'src/modules/posts/domain/repositories/post.repository';
import { PostNotFoundException } from 'src/modules/posts/domain/exceptions/post-not-found.exception';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository, 
  ) {}

  public async execute(
    id: string,
    user: UserEntity,
  ): Promise <void> {
    const comment = await this.commentRepository.getCommentById(id);
    
    if (!comment) {
      throw new CommentNotFoundException();
    }

    const authorId = (await this.postRepository.getPostById(comment.postId))?.authorId //await this.postProvider.getPostAuthorId(comment.postId)
    if (!authorId) {
      throw new PostNotFoundException()
    }

    if (!user.permissions.comments.canDelete(comment, authorId)) {
      throw new UserCannotUpdateCommentException();
    }

    await this.commentRepository.deleteComment(id);
  }
}
