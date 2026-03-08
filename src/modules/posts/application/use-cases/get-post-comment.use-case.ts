import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagService } from 'src/modules/tags/infrastructure/services/tag.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CommentService } from 'src/modules/comments/infrastructure/services/comment.service';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { CommentEntity } from 'src/modules/comments/domain/entities/comment.entity';

@Injectable()
export class GetPostCommentUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly commentService: CommentService,
  ) {}

  public async execute(
    idPost: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: string,
  ): Promise<CommentEntity[]> {
    const post = await this.postRepository.getPostById(idPost);
    if (!post) {
      throw new PostNotFoundException();
    }

    const allowedSort = ['createdAt', 'updatedAt']
    const allowedOrder = ['desc', 'asc']

    const finalSortBy = allowedSort.includes(sortBy) ? sortBy : allowedSort[0]
    const finalOrder = (allowedOrder.includes(order) ? order.toUpperCase() : allowedOrder[0].toUpperCase()) as 'ASC' | 'DESC';

    return this.commentService.getPostComment(idPost, page, pageSize, finalSortBy, finalOrder);
  }
}
