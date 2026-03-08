import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostEntity } from '../../domain/entities/post.entity';
import { TagService } from 'src/modules/tags/infrastructure/services/tag.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotUpdatePostTagsException } from '../../domain/exceptions/user-cannot-update-post-tags.exception';
import { TagNotFoundException } from 'src/modules/tags/domain/exceptions/tag-not-found.exception';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { PostAlreadyhasTagException } from '../../domain/exceptions/post-already-has-tag.exception';
import { PostTagAssociationNotFoundException } from '../../domain/exceptions/post-tag-association-not-found.exception';

@Injectable()
export class RemoveTagPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagService: TagService,
  ) {}

  public async execute(id: string, tagId: string, user: UserEntity) {
    const post = await this.postRepository.getPostById(id);

    if (post) {
      if (!user.permissions.posts.canUpdatePostTags(post)) {
        throw new UserCannotUpdatePostTagsException();
      }

      const tag = await this.tagService.getTagById(tagId);
      if (tag) {
        const alreadyLinked = post.tags.some((tag) => tag.id === tagId);
        if (!alreadyLinked) {
          throw new PostTagAssociationNotFoundException();
        }
        
        await this.postRepository.removeTag(id, tagId);
      } else {
        throw new TagNotFoundException();
      }
    } else {
      throw new PostNotFoundException();
    }
  }
}
