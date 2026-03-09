import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { CommentService } from './infrastructure/services/comment.service';
import { CommentRepository } from './domain/repositories/Comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/post.sqlite.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { PostModule } from '../posts/post.module';
import { PostRepository } from '../posts/domain/repositories/post.repository';
import { SQLitePostRepository } from '../posts/infrastructure/repositories/post.sqlite.repository';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [CommentController],
    providers: [
      {
        provide: CommentRepository,
        useClass: SQLiteCommentRepository,
      },

      {
        provide: PostRepository,
        useClass: SQLitePostRepository,
      },
  
      CommentService,
      UpdateCommentUseCase,
      DeleteCommentUseCase,
    ],
    exports: [CommentService]
})
export class CommentModule {}
