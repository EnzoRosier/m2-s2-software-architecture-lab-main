import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { CreateTagDto } from '../dtos/create-tags.dto';
import { TagEntity } from '../../domain/entities/tags.entity';

import { TagsName } from '../../domain/value-objects/tags-name.value-object';
import { TagAlreadyCreatedException } from '../../domain/exceptions/tag-already-created.exception';
import { TagCreatedEvent } from '../../domain/events/tag-created.event';
import { UserCannotCreateTagException } from '../../domain/exceptions/user-cannot-create-tag.exception';

@Injectable()
export class CreateTagUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tagRepository: TagsRepository,
  ) {}

  public async execute(input: CreateTagDto, user: UserEntity): Promise<TagEntity> {
    if (!user.permissions.tags.canCreate()) {
      throw new UserCannotCreateTagException();
    }

    const duplicateTag = await this.tagRepository.getTagByName(new TagsName(input.name).toString())

    if (duplicateTag) {
      throw new TagAlreadyCreatedException();
    }

    const tag = TagEntity.create(input.name, new Date(Date.now()));

    await this.tagRepository.createTag(tag);

    this.eventEmitter.emit(TagCreatedEvent, {
      tagId: tag.id,
    });

    return tag
  }
}
