import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostService } from '../../infrastructure/services/post.service';
import { SlugAlreadyTaken } from '../../domain/exceptions/slug-already-taken.exception';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
    private readonly postService: PostService,
  ) {}

  public async execute(input: CreatePostDto, user: UserEntity): Promise<PostEntity> {
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    let slug = await this.postService.generateSlug(input.title)

    if (input.slug) {
      slug = input.slug

      const duplicate = await this.postRepository.getBySlug(slug)

      if (duplicate) {
        throw new SlugAlreadyTaken();
      }
    }
    
    const post = PostEntity.create(input.title, input.content, input.authorId, slug);

    await this.postRepository.createPost(post);

    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.id,
      authorId: input.authorId,
    });

    return post;
  }
}
