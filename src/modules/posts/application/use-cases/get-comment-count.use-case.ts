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
import { CommentCountDto } from 'src/modules/comments/application/dtos/comment-count.dto';

@Injectable()
export class GetCommentCountUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
    private readonly commentService: CommentService,
  ) {}

  public async execute(postId: string): Promise<CommentCountDto> {
    const post = await this.postRepository.getPostById(postId)
    if (!post) {
      throw new PostNotFoundException()
    }
    return await this.commentService.getPostCommentCount(post.id);

  }
}
