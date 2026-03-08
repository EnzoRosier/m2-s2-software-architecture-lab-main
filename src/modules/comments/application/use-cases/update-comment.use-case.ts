import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentRepository } from '../../domain/repositories/Comment.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { CreateCommentDto } from 'src/modules/posts/application/dtos/create-tags.dto';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentNotFoundException } from '../../domain/exceptions/comment-not-found.exception';
import { UserCannotUpdateCommentException } from '../../domain/exceptions/user-cannot-update-comment.exception';


@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    id: string,
    input: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const comment = await this.commentRepository.getCommentById(id);
    if (!comment) {
      throw new CommentNotFoundException();
    }
    
    if (!user.permissions.comments.canUpdate(comment)) {
      throw new UserCannotUpdateCommentException();
    }

    comment.update(input.content)
    await this.commentRepository.updateComment(id, comment)
    
    return comment

  }
}
