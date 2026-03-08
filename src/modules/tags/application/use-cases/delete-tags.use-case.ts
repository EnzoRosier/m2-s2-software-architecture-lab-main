import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { UserCannotDeleteTagException } from '../../domain/exceptions/user-cannot-delete-tag.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagDeletedEvent } from '../../domain/events/tag-deleted.event';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';

@Injectable()
export class DeleteTagsUseCase {
  constructor(private readonly tagsRepository: TagsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    if (!user.permissions.tags.canDelete()) {
      throw new UserCannotDeleteTagException();
    }

    const tag = await this.tagsRepository.getTagById(id);
    if (tag) {
      await this.tagsRepository.deleteTag(id);

      this.eventEmitter.emit(TagDeletedEvent, {
        tagId: tag.id,
      });
    } else {
      throw new TagNotFoundException()
    }
  }
}
