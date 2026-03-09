import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { PostEntity } from '../../domain/entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  public async generateSlug(postTitle: string): Promise<string> {
    let slug = postTitle
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug || slug === '') {
      return `post-${Math.random().toString(36).substring(2, 7)}`;
    }

    let counter = 2;
    slug = slug.substring(0, 100);
    let baseSlug = slug;

    while (await this.postRepository.getBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
