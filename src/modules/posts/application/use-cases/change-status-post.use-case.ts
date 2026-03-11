import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { ChangeStatusPostDto } from '../dtos/change-status-post.dot';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostRejectedEvent } from '../../domain/events/post-rejected.event';
import { PostAcceptedEvent } from '../../domain/events/post-accepted.event';
import { PostPendingEvent } from '../../domain/events/post-pending.event';
import { NewPostEvent } from '../../domain/events/new-post.event';

@Injectable()
export class ChangeSatusPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(
    id: string,
    input: ChangeStatusPostDto,
    user: UserEntity,
  ): Promise<void> {
    const post = await this.postRepository.getPostById(id);

    if (post) {
      if (
        input.status === 'waiting' &&
        user.permissions.posts.canSetToWaiting(post)
      ) {
        post.update(undefined, undefined, input.status);

        this.eventEmitter.emit(PostPendingEvent, {
          postTitle: post.title,
          username: user.username,
          postId: post.id,
        });
      } else {
        if (
          (input.status === 'accepted' || input.status === 'rejected') &&
          !(post.status === 'draft') &&
          user.permissions.posts.canModeratePost(post)
        ) {
          post.update(undefined, undefined, input.status);

          if (input.status === 'rejected') {
            this.eventEmitter.emit(PostRejectedEvent, {
              postTitle: post.title,
              userId: post.authorId,
              postId: post.id,
            });
          } else {
            this.eventEmitter.emit(PostAcceptedEvent, {
              postTitle: post.title,
              userId: post.authorId,
              postId: post.id,
            });

            this.eventEmitter.emit(NewPostEvent, {
              postTitle: post.title,
              authorId: post.authorId,
              postId: post.id,
            });
          }
        }
      }

      await this.postRepository.updatePost(id, post);
    }
  }
}
