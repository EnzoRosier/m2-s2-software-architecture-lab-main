import { Injectable } from '@nestjs/common';
import { TagsRepository } from '../../domain/repositories/tags.repository';
import { TagEntity } from '../../domain/entities/tags.entity';

@Injectable()
export class TagService {
    constructor(
        private readonly tagsRepository: TagsRepository,
      ) {}
    
      public async getTagById(
        id: string,
      ): Promise<TagEntity | undefined> {
        const post = await this.tagsRepository.getTagById(id);
        if (!post) return;
    
        return post;
      }

      public async getTagByname(
        name: string,
      ): Promise<TagEntity | undefined> {
        const tag = await this.tagsRepository.getTagByName(name);
        if (!tag) return;
    
        return tag;
      }
}
