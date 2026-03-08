import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../../domain/repositories/Comment.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async createComment(comment: CommentEntity) {
    await this.commentRepository.createComment(comment);
  }

  public async getPostComment(
    idPost: string,
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ): Promise<CommentEntity[]> {
    return this.commentRepository.getPostComments(idPost, page, pageSize, sortBy, order)
  }
}
