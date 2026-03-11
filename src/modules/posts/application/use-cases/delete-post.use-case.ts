import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostDeletedEvent } from '../../domain/events/post-deleted.event';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string): Promise<void> {
    const post = await this.postRepository.getPostById(id)
    if (!post) {
      throw new PostNotFoundException()
    }

    await this.postRepository.deletePost(id);

    this.eventEmitter.emit(PostDeletedEvent, {
      title: post.title,
      userId: post.authorId,
    });
  }
}
