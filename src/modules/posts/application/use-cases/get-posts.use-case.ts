import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TagService } from 'src/modules/tags/infrastructure/services/tag.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class GetPostsUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly tagService: TagService,
  ) {}

  public async execute(tagsArray: string[], user : UserEntity): Promise<PostEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    var tagsIds: string[] = [];
    if (tagsArray.length > 0) {
      
      for (const tag of tagsArray) {
        var tagId = (await this.tagService.getTagByname(tag))?.id;
        if (!tagId) {
          return [];
        } else {
          tagsIds.push(tagId);
        }
      }
    }
    return this.postRepository.getPosts(tagsIds, user);
  }
}
