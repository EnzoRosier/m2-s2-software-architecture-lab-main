import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { UpdateTagDto } from '../dtos/update-tags.dto';
import { TagEntity } from '../../domain/entities/tags.entity';
import { TagNotFoundException } from '../../domain/exceptions/tag-not-found.exception';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserCannotUpdateTagException } from '../../domain/exceptions/user-cannot-update-tag.exception';
import { TagsName } from '../../domain/value-objects/tags-name.value-object';
import { TagAlreadyCreatedException } from '../../domain/exceptions/tag-already-created.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagUpdatedEvent } from '../../domain/events/tag-updated.event';

@Injectable()
export class UpdateTagsUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagsRepository: TagsRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    id: string,
    input: UpdateTagDto,
    user: UserEntity,
  ): Promise<TagEntity> {

    if (!user.permissions.tags.canUpdate()) {
      throw new UserCannotUpdateTagException();
    }

    const duplicateTag = await this.tagsRepository.getTagByName(
      new TagsName(input.name).toString(),
    );

    if (duplicateTag) {
      throw new TagAlreadyCreatedException();
    }

    const tag = await this.tagsRepository.getTagById(id);

    if (tag) {
      tag.update(input.name);
      await this.tagsRepository.updateTag(id, tag);

      this.eventEmitter.emit(TagUpdatedEvent, {
            tagId: tag.id,
          });

      return tag;
    } else {
      throw new TagNotFoundException();
    }
  }
}
