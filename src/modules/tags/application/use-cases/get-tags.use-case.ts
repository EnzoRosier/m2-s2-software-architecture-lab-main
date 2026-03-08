import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { TagEntity } from '../../domain/entities/tags.entity';

@Injectable()
export class GetTagsUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(): Promise<TagEntity[]> {
    this.loggingService.log('GetPostsUseCase.execute');
    return this.tagsRepository.getTags();
  }
}
