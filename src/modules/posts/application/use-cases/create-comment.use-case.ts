import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CommentRepository } from '../../../comments/domain/repositories/Comment.repository';
import { CommentEntity } from '../../../comments/domain/entities/comment.entity';
import { CreateCommentDto } from '../dtos/create-tags.dto';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { CommentService } from 'src/modules/comments/infrastructure/services/comment.service';
import { UserCannotCommentException } from '../../domain/exceptions/user-cannot-comment.exception';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
    private readonly commentService: CommentService,
  ) {}

  public async execute(input: CreateCommentDto, user: UserEntity, postId: string): Promise<CommentEntity> {
    const post = await this.postRepository.getPostById(postId)
    if (!post) {
      throw new PostNotFoundException()
    }

    if (!user.permissions.comments.canCreate(post)) {
      throw new UserCannotCommentException()
    }

    const comment = CommentEntity.create(input.content, user, postId);

    await this.commentService.createComment(comment);

    return comment
  }
}
