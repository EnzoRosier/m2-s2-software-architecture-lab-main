import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { CommentService } from './infrastructure/services/comment.service';
import { CommentRepository } from './domain/repositories/Comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/post.sqlite.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [CommentController],
    providers: [
      {
        provide: CommentRepository,
        useClass: SQLiteCommentRepository,
      },
  
      CommentService,
      UpdateCommentUseCase,
    ],
    exports: [CommentService]
})
export class CommentModule {}
