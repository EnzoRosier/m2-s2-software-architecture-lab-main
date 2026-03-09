import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { ChangeSlugDto } from '../dtos/change-slug-post.dot';
import { PostService } from '../../infrastructure/services/post.service';
import { SlugAlreadyTaken } from '../../domain/exceptions/slug-already-taken.exception';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotChangeSlug } from '../../domain/exceptions/user-cannot-change-slug.exception';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';

@Injectable()
export class ChangeSlugPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postService: PostService,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    input: ChangeSlugDto,
    user: UserEntity,
  ): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(id);

    const duplicate = await this.postRepository.getBySlug(input.slug);
    if (duplicate) {
      throw new SlugAlreadyTaken();
    }

    if (post) {
      if (!user.permissions.posts.canChangePostSlug(post)) {
        throw new UserCannotChangeSlug()
      }
      post.update(undefined, undefined, undefined, input.slug);
      await this.postRepository.updatePost(id, post);

      return post
    } else {
      throw new PostNotFoundException()
    }
  }
}
