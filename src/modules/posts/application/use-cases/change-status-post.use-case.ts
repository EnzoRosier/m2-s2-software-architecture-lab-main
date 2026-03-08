import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { ChangeStatusPostDto } from '../dtos/change-status-post.dot';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class ChangeSatusPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(id: string, input: ChangeStatusPostDto, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(id);

    if (post) {
      if (input.status === 'waiting' && user.permissions.posts.canSetToWaiting(post)) {
        post.update(undefined, undefined, input.status);
      }

      if ((input.status === 'accepted' || input.status === 'rejected') && post.status === 'waiting' && user.permissions.posts.canModeratePost(post)) {
        post.update(undefined, undefined, input.status);
      }
      post.update(undefined, undefined, input.status);
      await this.postRepository.updatePost(id, post);
    }
  }
}
