import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { TagEntity } from '../../domain/entities/tags.entity';
import { GetTagDto } from '../dtos/get-tag-dto';

@Injectable()
export class GetTagsUseCase {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(): Promise<GetTagDto> {
    this.loggingService.log('GetPostsUseCase.execute');
    let res = new GetTagDto()
    res.tags = await this.tagsRepository.getTags()
    return res;
  }
}
