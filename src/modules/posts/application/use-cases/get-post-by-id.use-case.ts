import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostService } from '../../infrastructure/services/post.service';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { UserCannotReadPost } from '../../domain/exceptions/user-cannot-read-post.exception';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    user: UserEntity,
  ): Promise<PostEntity | undefined> {
    this.loggingService.log('GetPostByIdUseCase.execute');

    let post = await this.postRepository.getBySlug(id);
    if (!post) {
      post = await this.postRepository.getPostById(id);
      if (!post) throw new PostNotFoundException();
    }
    
    if (!user && post.status != "accepted") {
      throw new UserCannotReadPost()
    } else if (user && !user.permissions.posts.canReadPost(post)) {
      throw new UserCannotReadPost()
    }

    return post;
  }
}
